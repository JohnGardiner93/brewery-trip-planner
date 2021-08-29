////////////////////////////////////////////
// Modules
const inquirer = require("inquirer");
const fuzzy = require("fuzzy");
const geography = require("./modules/geography/geography");
const { states } = require("./data/stateList.json");

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
    // Get User Input
    const state = await getLocationInput(`Select a state:`, states);
    console.log(`------------------\n`, `Gathering cities in ${state}...`);
    const cities = await geography.getTownsAndCities(state);
    console.log(`${cities.length} cities acquired!\n`, `------------------`);
    const city = await getLocationInput(`Select a city:`, cities);
  console.log(city);
  } catch (err) {
    console.log(err.message);
  }

  // Get brewery and weather data simultaneously
  // Format weather data
  // Get brewery data
  // Format brewery data
  // Store data
  // Display data to user
};

////////////////////////////////////////////
(async () => {
  try {
    await init();
  } catch (err) {
    console.log(err.message);
  }
})();
