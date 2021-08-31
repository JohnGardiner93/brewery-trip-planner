////////////////////////////////////////////
// Modules
const inquirer = require("inquirer");
const superagent = require("superagent");
const fuzzy = require("fuzzy");
const geography = require("./modules/geography/geography");
const { states } = require("./data/stateList.json");
const breweries = require("./modules/breweries/breweries");
require("dotenv").config();

////////////////////////////////////////////
// Functions

/**
 * Retrieves user input in console. Provides list of options to user. Choice offerings adapt to what user has typed into console using fuzzy search.
 * @async
 * @param {String} message - Message to be displayed to the user.
 * @param {String[]} inputOptions - List of options that the user can choose from. User cannot input any freely typed text.
 * @returns {Promise<String>} - The user's choice from the list of options.
 */
const getLocationInput = async function (message, inputOptions) {
  try {
    const answer = await inquirer.prompt([
      {
        type: "autocomplete",
        name: "result",
        message: `${message}`,
        source: (_, input) => searchList(input, inputOptions),
      },
    ]);
    return answer.result;
  } catch (err) {
    throw new Error(`Problem with input function`);
  }
};

/**
 * Retrieves a list of potential matches using a provided input (search term) and the list that is to be searched. Uses fuzzy search to retrieve logical potential options. Returns relevant list based on provided input.
 * @async
 * @param {String} input - Search term.
 * @param {*} inputOptions - List to be searched.
 * @returns {Promise<String>} - List of potential matches based on provided input.
 */
const searchList = async function (input, inputOptions) {
  try {
    input = input || "";
    const results = fuzzy.filter(input, inputOptions);
    const matches = results.map((el) => {
      return el.string;
    });
    return matches;
  } catch (err) {
    console.log(`🔎 Search error`);
  }
};

/*
const searchList = async function (input, inputOptions) {
  input = input || "";
  return new Promise((resolve) => {
    let results = fuzzy.filter(input, inputOptions);
    const matches = results.map((el) => {
      return el.string;
    });
    resolve(matches);
  });
};
*/

/**
 * Runs the program.
 */
const init = async function () {
  // REQUIRED to use autocomplete prompt in inquirer module.
  inquirer.registerPrompt(
    "autocomplete",
    require("inquirer-autocomplete-prompt")
  );

  try {
    const APIkey = process.env.API_key;

    // Get User Input
    const stateName = await getLocationInput(`Select a state:`, states);
    console.log(`------------------\n`, `Gathering cities in ${stateName}...`);
    const cityData = await geography.getTownsAndCities(stateName);
    console.log(`${cityData.size} cities acquired!\n`, `------------------`);
    const cityName = await getLocationInput(`Select a city:`, [
      ...cityData.keys(),
    ]);

    const { latitude, longitude } = cityData.get(cityName);

    const stateSlug = slugify(state, `_`);
    const citySlug = slugify(cityName, `_`);
    // Get brewery data
    console.log(`------------------\n`, `Gathering results for ${cityName}...`);
    const breweryResults = await superagent.get(
      `https://api.openbrewerydb.org/breweries?by_state=${stateSlug}&by_city=${citySlug}&sort=name:asc`
    );

    // Get weather data
    const weatherResults = await superagent.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&appid=${APIkey}`
    );

    console.log(breweryResults.body);
    console.log(weatherResults.body);
    // Format brewery data

    // Format weather data
    // Store data
    // Display data to user
  } catch (err) {
    console.log(err.message);
  }
};

////////////////////////////////////////////
(async () => {
  try {
    await init();
  } catch (err) {
    console.log(err.message);
  }
})();
