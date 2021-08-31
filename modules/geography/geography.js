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
    const stateCode = await getStateCode(state);
    const searchURL = `https://public.opendatasoft.com/api/v2/catalog/datasets/cities-and-towns-of-the-united-states/exports/json?select=include(name)%2C%20include(state)%2C%20include(longitude)%2C%20include(latitude)%2C%20include(county)&order_by=name%20asc&limit=-1&refine=state%3A${stateCode}&pretty=false&timezone=UTC`;
    const results = await superagent.get(searchURL);

    // Save search results for debug. Non-blocking.
    saveSearchResults(results.body, `${__dirname}/data/townsAndCities.json`);

    // Compile relevant results into array
    const list = await restructureCityInformation(results.body);
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
      newObj["county"] = city?.county;
      newObj["longitude"] = city?.longitude;
      newObj["latitude"] = city?.latitude;

      if (!city.name)
        throw new Error(`🏙 City Name does not exist. Data format incorrect.`);
      results.set(city?.name, newObj);
    });
    return results;
  } catch (err) {
    throw err;
  }
};
