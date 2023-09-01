const express = require("express");
const app = express();
const bodyParser=require("body-parser");
const https = require("https");
const apikey = "";

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
res.sendFile(__dirname+"/index.html");
    
});
app.post("/", function (req, res){
    const query=req.body.cityName;
    // console.log(query);
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apikey +"&units=metric";
    
    https.get(url,function(response){
        console.log(response.statusCode);
        
    response.on("data",function(data){
        const weatherData= JSON.parse(data);
        const temp=weatherData.main.temp;
        const humidity=weatherData.main.humidity;
        const desc=weatherData.weather[0].description;
        const iconCode=weatherData.weather[0].icon;
        const iconurl="http://openweathermap.org/img/wn/"+iconCode+"@2x.png"
        res.write("<h1>Temperature in "+ query +" is "+temp+"</h1>");
        res.write("<p>Weather feels like "+desc+"</p>");
        res.write("<p>Humidity is "+humidity+"</p>");
        res.write("<img src="+ iconurl+ "></img>")
        res.send();
        });
    });

});

app.listen(3000, function () {
    console.log("Server is running at port 3000");
})