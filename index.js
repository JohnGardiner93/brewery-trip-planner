////////////////////////////////////////////
// Modules
const inquirer = require("inquirer");

////////////////////////////////////////////
// Functions
/**
 * Gets the name of the city of interest from the user.
 * @returns {String || undefined} - The string containing the city name (or undefined if the city was not valid)
 * @todo - Check that the user's input city is valid.
 */
const getCityName = async function () {
  const answer = await inquirer.prompt([
    { name: "city", message: "What city are you visiting?" },
  ]);
  return answer.city;
};

/**
 * Runs the program.
 */
const init = async function () {
  // Create Server?
  // Get city information from user
  const city = await getCityName();
  console.log(city);
  // Check if city is valid
  // If city is valid, get weather data
  // Format weather data
  // If city is valid, get brewery data
  // Format weather data
  // Store data
  // Display data to user
  // Repeat?
};

////////////////////////////////////////////
(async () => {
  try {
    await init();
  } catch (error) {
    console.log(error.message);
  }
})();
