const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path")
require("dotenv").config();
const fs = require("fs")
require('./scheduler')


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");

});
app.get("/register", function (req, res) {
    res.sendFile(__dirname + "/register.html")
});

app.post("/register-farmer", function (req, res) {
    console.log(req);
    const farmer_name = req.body.name;
    const farmer_city = req.body.city;
    const farmer_contact = req.body.contact;
    let farmers = []

    try {
        if (fs.existsSync("farmers-info.json")) {
            const data = fs.readFileSync("farmers-info.json", "utf-8");
            farmers = JSON.parse(data);
        }
    } catch (err) {
        console.error("Error reading farmers.json:", err);
    }
    farmers.push({ farmer_name, farmer_city, farmer_contact })
    fs.writeFile("farmers-info.json", JSON.stringify(farmers, null, 2), (err) => {
        if (err) {
            console.error("Error saving farmer:", err);
            return res.send("Registration failed. Try again.");
        }
        res.send("Farmer registered successfully. <a href='/'>Go to Home</a>");
    });
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
                console.log(weatherData);

                if (+weatherData.cod !== 200) {
                    return res.json({ error: "City not found" });
                }

                const temp = weatherData.main.temp;
                const humidity = weatherData.main.humidity;
                const desc = weatherData.weather[0].description;
                const iconCode = weatherData.weather[0].icon;
                const iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

                res.json({
                    city: query,
                    temperature: temp,
                    humid: humidity,
                    description: desc,
                    iconUrl: iconUrl
                });
            } catch (error) {
                console.error("Error parsing data:", error.message);
                res.json({ error: "Something went wrong. Please try again." });
            }
        });
    });
});

app.listen(3000, function () {
    console.log("Server is running at port 3000");
})