/**
 * Asynchronous (promisified) version of JSON.stringify(). Converts provided JSON object into string.
 * @async
 * @param {Object} input - JSON object to be stringified.
 * @returns {Promise<String>} - Promise representing the stringified version of the provided JSON.
 */
module.exports = async function (input) {
  try {
    const output = JSON.stringify(input);
    if (!output) throw `Input provided not valid`;
    return output;
  } catch (err) {
    throw err;
  }
};
