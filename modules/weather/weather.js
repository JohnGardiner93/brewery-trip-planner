////////////////////////////////////////////
// Modules
const superagent = require("superagent");
const saveSearchResults = require("../my-utils/saveSearchResults");
require("dotenv").config();

////////////////////////////////////////////

/**
 * Performs API Call to retrieve the weather in a location from Open Weather. Stores search results locally for debug.
 * @param {*} latitude - Latitude of the desired location.
 * @param {*} longitude - Longitude of the desired location.
 * @returns {Promise<Object>} - Promise representing a list of day objects. Each object has the date, max temp, windspeed, humidity, and an icon.
 */
exports.getWeatherAtLocation = async function (latitude, longitude) {
  try {
    // Make API Call
    console.log(`------------------\n`, `Gathering weather results...`);
    const APIkey = process.env.API_key;
    const results = await superagent.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&units=imperial&appid=${APIkey}`
    );

    // Process results
    saveSearchResults(results.body, `${__dirname}/data/weather.json`);
    const list = await getDailyForecast(results.body);

    return list;
  } catch (err) {
    throw new Error(
      `🍺 There was an error in weather.getWeatherAtLocation:\n >> ${err.message}`
    );
  }
};

/**
 * Retrieves and reformats daily forecast information from weather API call results.
 * @async
 * @param {Object[]} weatherData - Weather data from result of OpenWeatherAPI call.
 * @returns {Promise<Object>} - Promise representing a list of day objects. Each object has the date, max temp, windspeed, humidity, and an icon.
 */
const getDailyForecast = async function (weatherData) {
  try {
    const list = weatherData.daily.map((day) => {
      const myObj = {};
      myObj.day = day?.dt;
      myObj.temp = day?.temp?.max;
      myObj.windSpeed = day?.wind_speed;
      myObj.humidity = day?.humidity;
      myObj.icon = day?.weather[0]?.icon;
      return myObj;
    });

    return list;
  } catch (err) {
    throw err;
  }
};
