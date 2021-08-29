/**
 * Asynchronous (promisified) version of JSON.stringify(). Converts provided JSON object into string.
 * @async
 * @param {Object} input - JSON object to be stringified.
 * @returns {Promise} - Promise representing the stringified version of the provided JSON.
 */
module.exports = async function (input) {
  return new Promise((resolve, reject) => {
    const output = JSON.stringify(input);
    if (!output) reject(`Input provided not valid`);
    resolve(output);
  });
};
