////////////////////////////////////////////
// Modules
const fs = require("fs");
const slugify = require("slugify");

////////////////////////////////////////////
// Read Files when loading module
const breweryTemplate = fs.readFileSync(
  `${__dirname}/templates/breweryCard.html`,
  `utf-8`
);
const weatherTemplate = fs.readFileSync(
  `${__dirname}/templates/weatherCard.html`,
  `utf-8`
);
const resultsTemplate = fs.readFileSync(
  `${__dirname}/templates/results.html`,
  `utf-8`
);

////////////////////////////////////////////
// Global Variables
const resultsPageFilePath = `${__dirname}/resultsPage.html`;

////////////////////////////////////////////
// Functions
/**
 * Builds a results page that can be viewed. Results page will show the date, requested locatoin, 5-day forecast, and a list of breweries in the requested area.
 * @async
 * @param {Object[]} breweryData - List of objects containing brewery information.
 * @param {Object[]} weatherData - List of objects containing information about the next 7 days of weather.
 * @param {String} state - The state of interest.
 * @param {String} city - The city of interest.
 * @param {String} locale - Locale string used for localizing data and time information (example: 'en-us')
 * @returns
 */
exports.buildResultsPage = async function (
  breweryData,
  weatherData,
  state,
  city,
  locale
) {
  const breweryHTML = buildBreweryElements(breweryData);
  const weatherHTML = buildWeatherElements(weatherData, locale, 5);

  const result = await Promise.all([weatherHTML, breweryHTML]);
  const readableDate = generateReadableDate(Date.now(), locale);

  // Build results page
  let output = resultsTemplate
    .replace(/{%DATE%}/g, readableDate)
    .replace(/{%CITY%}/g, city)
    .replace(/{%STATE%}/g, state)
    .replace(/{%WEATHER%}/g, result[0])
    .replace(/{%BREWERIES%}/g, result[1]);

  // Save page to fs
  saveResultsPage(output, resultsPageFilePath);
  console.log(`Page generated.`);

  return undefined;
};

/**
 * Builds brewery HTML elements based on the provided brewery data.
 * @aync
 * @param {Object[]} breweryData - List of brewery object
 * @returns {String} HTML containing all the brewery elements generated.
 */
const buildBreweryElements = async function (breweryData) {
  const result = breweryData.map((brewery, index) => {
    const addressLink = generateBreweryAddressLink(brewery);
    const fullAddress = stitchBreweryAddressLink(brewery);
    const websiteLink = generateBreweryWebsiteLink(brewery?.website_url);

    let output = breweryTemplate
      .replace(/{%NAME%}/g, brewery?.name || "")
      .replace(/{%ADDRESSLINK%}/g, addressLink || "")
      .replace(/{%ADDRESS%}/g, fullAddress || "")
      .replace(/{%PHONENUMBER%}/g, brewery?.phone || "")
      .replace(/{%WEBSITELINK%}/g, websiteLink || "")
      .replace(/{%COLOR%}/g, index % 2 === 0 ? "dark" : "light");

    return output;
  });

  return result.join("");
};

/**
 * Cleans up the link to a website by removing "http" or "https". If the website provided is blank, it is returned.
 * @param {String} website - String to manipulated.
 * @returns {String} - Cleaned-up website link
 */
const generateBreweryWebsiteLink = function (website) {
  const websiteLink = +website || "";
  let result = websiteLink.replace("http://", "").replace("https://", "");
  return result;
};

/**
 * Creates a String contiaining a link via Google Maps to the provided location.
 * @param {Object} brewery - The brewery object for which the string will be generated.
 * @param {String} brewery.name - The name of the brewery.
 * @param {String} brewery.city - The city in which the brewery is located.
 * @param {String} brewery.state - The state in which the brewery is located.
 * @returns {String} String representing the link to the google maps representation of the provided brewery.
 */
const generateBreweryAddressLink = function ({ name, city, state }) {
  // Example
  //http://maps.google.com/maps?q=Ardent+Craft+Ales+richmond+virginia
  const nameSlug = slugify(name, "+");
  const citySlug = slugify(city, "+");
  const stateSlug = slugify(state, "+");

  return `http://maps.google.com/maps?q=${nameSlug}+${citySlug}+${stateSlug}`;
};

/**
 * Creates a String representing the address of the provided brewery. Handles whether or not the provided brewery has secondary and tertiary address information.
 * @param {Object} brewery - The brewery object for which the string will be generated.
 * @param {String} brewery.street - The street on which the brewery is located.
 * @param {String} brewery.address_2 - The street (secondary) on which the brewery is located.
 * @param {String} brewery.address_3 - The street (tertiary) on which the brewery is located.
 * @param {String} brewery.city - The city in which the brewery is located.
 * @param {String} brewery.state - The state in which the brewery is located.
 * @param {String} brewery.postal_code - The postal code in which the brewery is located.
 * @returns String representing the address of the provided brewery
 */
const stitchBreweryAddressLink = function ({
  street,
  address_2,
  address_3,
  city,
  state,
  postal_code,
}) {
  const primaryAddress =
    `${street ? street : ""}` +
    `${address_2 ? " " + address_2 + "," : ""}` +
    `${address_3 ? " " + address_3 + "," : ""}`;

  return `${primaryAddress ? primaryAddress + ", " : ""}${city}, ${state} ${
    postal_code ? postal_code : ""
  }`;
};

/**
 * Builds weather HTML elements based on the provided forecast data. Number of returned days can be specified up to the number of weather objects provided.
 * @param {Object[]} weatherData - List of objects each representing a day. Each object contains weather information for that day.
 * @param {*} locale - String used to localize time and date information for the user (example 'en-us')
 * @param {*} limit - The maximum number of weather elements to be built.
 * @returns {String} HTML for each of the desired days of weather information.
 */
const buildWeatherElements = async function (weatherData, locale, limit) {
  const result = weatherData.map((day, index) => {
    if (index >= limit) return;

    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    const readableDate = generateReadableDate(day?.day * 1000, locale);
    const iconLink = generateIconLink(day?.icon);

    let output = weatherTemplate
      .replace(/{%DATE%}/g, readableDate)
      .replace(/{%WEATHERICON%}/g, iconLink)
      .replace(/{%TEMPERATURE%}/g, Math.round(day?.temp))
      .replace(/{%WIND%}/g, Math.round(day?.windSpeed))
      .replace(/{%HUMIDITY%}/g, day?.humidity)
      .replace(/{%COLOR%}/g, index % 2 === 0 ? "dark" : "light");
    return output;
  });

  return result.join("");
};

/**
 * Converts provided UTC date code into a human-readable String.
 * @param {Number} dateCode - UTC code for desired date.
 * @param {String} locale - String used to localize time and date information for the user (example 'en-us')
 * @returns {String} - String representing the provided date in human-readable format.
 */
const generateReadableDate = function (dateCode, locale) {
  const date = new Date(dateCode);
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(locale, options);
};

/**
 * Creates string used to retrieve specific icon from openweathermap.org using provided icon code.
 * @param {String} iconSnippet - Icon code to be retrieved.
 * @returns {String} String representing the link to the desired icon.
 */
const generateIconLink = function (iconSnippet) {
  return `http://openweathermap.org/img/w/${iconSnippet}.png`;
};

/**
 * Saves the provided information to the desired filepath.
 * @param {String} page - Information to be saved to the file.
 * @param {String} filepath - The desired location and name of the file.
 * @returns {undefined || -1} Returns undefined if no error. Returns -1 if error.
 */
const saveResultsPage = async function (page, filepath) {
  try {
    await fs.promises.writeFile(filepath, page);
    return undefined;
  } catch (err) {
    console.log(`File failed to write`);
    return -1;
  }
};
