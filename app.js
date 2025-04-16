const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path")
require("dotenv").config();


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");

});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    // console.log(query);
    const apikey = process.env.API_KEY;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apikey + "&units=metric";

    https.get(url, function (response) {
        console.log(response.statusCode);    
        response.on("data", function (data) {
            try {
                const weatherData = JSON.parse(data);
    
                if (+weatherData.cod !== 200) {
                    return res.send(`<h2>Error: ${weatherData.message}</h2>`);
                }
    
                const temp = weatherData.main.temp;
                const humidity = weatherData.main.humidity;
                const desc = weatherData.weather[0].description;
                const iconCode = weatherData.weather[0].icon;
                const iconurl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

                res.write("<h1>Temperature in " + query + " is " + temp + "°C</h1>");
                res.write("<p>Weather feels like " + desc + "</p>");
                res.write("<p>Humidity is " + humidity + "%</p>");
                res.write("<img src=" + iconurl + " />");
                res.send();
            } catch (error) {
                console.error("Error parsing data:", error.message);
                res.send("<h2>Something went wrong. Please try again.</h2>");
            }
        });
    });
});

app.listen(3000, function () {
    console.log("Server is running at port 3000");
})