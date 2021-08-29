/**
 * Asynchronously searches through an object's properties via the object's properties' values. User must provide object to be searched and the desired search target. Option to modulate the objects' values to uppercase or lowercase can be enabled to make search and compare easier.
 * @async
 * @param {Object} object - Object to be searched.
 * @param {*} searchValue - Value to be found.
 * @param {Object} [options] - Optional. False by default. User can specify if lower or uppercase modifiers are to be used.
 * @returns {Promise<String>} Promise representing key value. If key value not found, promise is rejected.
 */
module.exports = async function (
  object,
  searchValue,
  options = { uppercase: false, lowercase: false }
) {
  try {
    const key = Object.keys(object).find((key) => {
      if (options.uppercase) {
        return object[key].toUpperCase() === searchValue;
      }
      if (options.lowercase) {
        return object[key].toLowerCase() === searchValue;
      }
      return object[key] === searchValue;
    });
    if (key === undefined) throw new Error();
    return key;
  } catch (err) {
    throw new Error(`Key not found`);
  }
};
