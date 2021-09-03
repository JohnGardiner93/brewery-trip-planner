////////////////////////////////////////////
// Modules
const inquirer = require("inquirer");
const fuzzy = require("fuzzy");
const geography = require("./modules/geography/geography");
const { states } = require("./data/stateList.json");
const breweries = require("./modules/breweries/breweries");
const weather = require("./modules/weather/weather");
const resultsPage = require("./modules/resultsPage/resultsPage");

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
    // Get User Input
    const stateName = await getLocationInput(`Select a state:`, states);

    console.log(`------------------\n`, `Gathering cities in ${stateName}...`);
    const cityData = await geography.getTownsAndCities(stateName);

    console.log(`${cityData.size} cities acquired!\n`, `------------------`);
    const cityName = await getLocationInput(`Select a city:`, [
      ...cityData.keys(),
    ]);

    const { latitude, longitude } = cityData.get(cityName);

    const breweryResults = breweries.getBreweriesInCity(stateName, cityName);
    const weatherResults = weather.getWeatherAtLocation(latitude, longitude);
    const result = await Promise.all([breweryResults, weatherResults]);

    const pageResults = await resultsPage.buildResultsPage(
      result[0],
      result[1],
      stateName,
      cityName,
      `en-US`
    );
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
