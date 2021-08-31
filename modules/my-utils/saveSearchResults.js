const fs = require("fs");
const stringifyJSON = require("../my-utils/stringifyJSONPro");

/**
 * Saves JSON to file. Converts JSON to string, then saves.
 * @async
 * @param {Object[]} data - Response from web page with objects.
 * @param {String} filepath - Desired file savepath.
 * @returns {Promise<*>} - Promise representing success or failure to write. Returns undefined with successful file write. Returns -1 if file fails to write.
 */
module.exports = async function (data, filepath) {
  try {
    const resultsText = await stringifyJSON(data);
    await fs.promises.writeFile(filepath, resultsText);
    return undefined;
  } catch (err) {
    console.log(`File failed to write`);
    return -1;
  }
};
