const cron = require("node-cron");
const https = require("https");
require("dotenv").config();
const fs = require("fs");
const sendSMS =require('./send-sms');

const farmers=JSON.parse(fs.readFileSync("farmers-info.json","utf8"));
const cities=[...new Set(farmers.map(f=>f.farmer_city))]
console.log(cities)

function checkWeather(city) {
  const apikey = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;

  https.get(url, function (response) {
    let data = "";

    response.on("data", (chunk) => data += chunk);

    response.on("end", () => {
      try {
        const weatherData = JSON.parse(data);

        if (!weatherData.weather || !weatherData.weather[0]) {
          throw new Error("Malformed weather data");
        }

        const description = weatherData.weather[0].description.toLowerCase();

        if (description.includes('rain')) {
          console.log(`🌧️ Rain predicted in ${city}. Notify farmers!`);
          sendSMS(city);
        } else {
          console.log(`✅ No rain in ${city}.`);
        }
      } catch (err) {
        console.error(`❌ Failed to parse weather for ${city}:`, err.message);
      }
    });

  }).on("error", err => {
    console.error(`❌ Request error for ${city}:`, err.message);
  });
}

cron.schedule('*/2 * * * *', () => {
  console.log("🔄 Checking weather for all cities...");
  cities.forEach(checkWeather);
});
