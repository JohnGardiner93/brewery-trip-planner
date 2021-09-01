////////////////////////////////////////////
// Modules
const superagent = require("superagent");
const slugify = require("slugify");
const saveSearchResults = require("../my-utils/saveSearchResults");

////////////////////////////////////////////

/**
 * Performs API Call to retrieve the breweries in a town/city from Open-Brewery-DB. Stores search results locally for debug.
 * @param {String} stateName - State of interest.
 * @param {String} cityName - City of interest.
 * @returns {Object[]} - Promise representing list of brewery objects.
 */
exports.getBreweriesInCity = async function (stateName, cityName) {
  try {
    // Required formatting for API call
    const stateSlug = slugify(stateName, `_`);
    const citySlug = slugify(cityName, `_`);
    console.log(
      `------------------\n`,
      `Gathering brewery results for ${cityName}...`
    );
    const results = await superagent.get(
      `https://api.openbrewerydb.org/breweries?by_state=${stateSlug}&by_city=${citySlug}&sort=name:asc`
    );

    saveSearchResults(results.body, `${__dirname}/data/breweries.json`);

    return results.body;
  } catch (err) {
    throw new Error(
      `🍺 There was an error in breweries.getBreweriesInCity:\n >> ${err.message}`
    );
  }
};
