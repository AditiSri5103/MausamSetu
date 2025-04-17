const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path")
require("dotenv").config();


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");

});

app.post("/", function (req, res) {
    const query = req.body.city;
    console.log(query);
    const apikey = process.env.API_KEY;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apikey + "&units=metric";

    https.get(url, function (response) {
        console.log(response.statusCode);    
        response.on("data", function (data) {
            try {
                const weatherData = JSON.parse(data);
    
                if (+weatherData.cod !== 200) {
                    return res.json({error:"City not found"});
                }
    
                const temp = weatherData.main.temp;
                const humidity = weatherData.main.humidity;
                const desc = weatherData.weather[0].description;
                const iconCode = weatherData.weather[0].icon;
                const iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

                res.json({
                    city:query,
                    temperature:temp,
                    humid:humidity,
                    description:desc,
                    iconUrl:iconUrl
                });
            } catch (error) {
                console.error("Error parsing data:", error.message);
                res.json({error:"Something went wrong. Please try again."});
            }
        });
    });
});

app.listen(3000, function () {
    console.log("Server is running at port 3000");
})