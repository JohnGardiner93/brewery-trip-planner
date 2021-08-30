////////////////////////////////////////////
// Modules
const fs = require("fs");
const superagent = require("superagent");
const stringifyJSON = require("../my-utils/stringifyJSONPro");
const findKeyByValue = require("../my-utils/findKeyByValue");
const stateCodes = require("./data/stateCodes.json");

////////////////////////////////////////////

/**
 * Retrieves a sorted list of town and cities in a state using the state provided. State code is determined before constructing searchURL.
 * @async
 * @param {String} state - State whose cities and towns are desired.
 * @returns {Promise<String[]>} - Promise of list of cities and towns (Strings) in the state provided.
 */
exports.getTownsAndCities = async function (state) {
  try {
    // Search
    const stateCode = await getStateCode(state);
    const searchURL = `https://public.opendatasoft.com/api/v2/catalog/datasets/cities-and-towns-of-the-united-states/exports/json?select=include(name)%2C%20include(state)%2C%20include(longitude)%2C%20include(latitude)%2C%20include(county)&order_by=name%20asc&limit=-1&refine=state%3A${stateCode}&pretty=false&timezone=UTC`;
    const results = await superagent.get(searchURL);

    // Save search results for debug. Non-blocking.
    saveSearchResults(results);

    // Compile relevant results into array
    const list = await compileTownAndCityList(results.body);
    return list;
  } catch (err) {
    throw new Error(
      `🏫 There was an error in geography.getTownsAndCities:\n >> ${err.message}`
    );
  }
};

/**
 * Retrieves the state code of the provided state. If a valid state code is provided, returns provided value.
 * @async
 * @param {String} state
 * @returns {Promise<String>}
 */
const getStateCode = async function (state) {
  try {
    const location = state.toUpperCase().trim();
    // If state provided is already a valid state code
    if (location in stateCodes) return location;

    const stateCode = await findKeyByValue(stateCodes, location, {
      uppercase: true,
    });
    return stateCode;
  } catch (err) {
    throw new Error(`getStateCode: State code not found`);
  }
};

/**
 * Condenses city and town objects into a list of their names without any extra information.
 * @async
 * @param {Object[]} data - The list of city and town objects.
 * @returns {Promise<String[]>} - Promise representing Array of city and town names.
 */
const compileTownAndCityList = async function (data) {
  const list = data.map((area) => area.name);
  return list;
};

/**
 * Saves JSON to file.
 * @async
 * @param {Object[]} results - Response from web page with objects.
 * @returns {Promise<*>} - Promise representing success or failure to write. Returns undefined with successful file write. Returns -1 if file fails to write.
 */
const saveSearchResults = async function (results) {
  try {
    const resultsText = await stringifyJSON(results.body);
    await fs.promises.writeFile(
      `${__dirname}/data/townsAndCities.json`,
      resultsText
    );
    return undefined;
  } catch (err) {
    console.log(`File failed to write`);
    return -1;
  }
};
