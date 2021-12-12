////////////////////////////////////////////
// Modules
const superagent = require("superagent");
const findKeyByValue = require("../my-utils/findKeyByValue");
const stateCodes = require("./data/stateCodes.json");
const saveSearchResults = require("../my-utils/saveSearchResults");

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
    const searchURL = `https://public.opendatasoft.com/api/v2/catalog/datasets/georef-united-states-of-america-place-millesime/exports/json?select=pla_name%2C%20ste_name%2C%20geo_point_2d%2C%20coty_name&order_by=pla_name%20asc&limit=-1&offset=0&refine=ste_name%3A${state}&lang=en&timezone=UTC`;
    const results = await superagent.get(searchURL);
    // Save search results for debug. Non-blocking.
    saveSearchResults(results.body, `${__dirname}/data/townsAndCities.json`);

    // Compile relevant results into array
    const list = await restructureCityInformation(results.body);
    return list;
  } catch (err) {
    throw new Error(
      `🏫 There was an error in geography.getTownsAndCities:\n >> ${err}`
    );
  }
};

/**
 * Restructures data from list of objects to Map where the name of each city is a key whose value pair is an object containing the county, longitude, and latitude.
 * @async
 * @param {Object[]} apiCallResults - List of objects retrieved from API call.
 * @returns {Map} Map of results. Keys = city names. Values contain city information.
 */
const restructureCityInformation = async function (apiCallResults) {
  try {
    const results = new Map();
    apiCallResults.forEach((city) => {
      // console.log(city);
      const newObj = {};
      newObj["county"] = city?.coty_name[0];
      newObj["longitude"] = city?.geo_point_2d.lon;
      newObj["latitude"] = city?.geo_point_2d.lat;

      if (!city?.pla_name[0])
        throw new Error(`🏙 City Name does not exist. Data format incorrect.`);
      results.set(city?.pla_name[0], newObj);
    });
    return results;
  } catch (err) {
    throw err;
  }
};
