const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const app = express();
const port = 3000;

// List of cities with their coordinates
const cities = {
  london: { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  new_york: { name: 'New York', latitude: 40.7128, longitude: -74.0060 },
  tokyo: { name: 'Tokyo', latitude: 35.6895, longitude: 139.6917 },
  sydney: { name: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
  dubai: { name: 'Dubai', latitude: 25.276987, longitude: 55.296249 }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//When a GET request is made to the root URL ("/"), this code will send the "index.html" file located in the "public" directory as the response
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/", (req, res) => {
  var city = req.body.city;
  request(`https://api.open-meteo.com/v1/forecast?latitude=${cities[city].latitude}&longitude=${cities[city].longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m`, function(error, response, body) {
    var weather = JSON.parse(response.body).current;
    res.send(`<h1>${cities[city].name}</h1>
              <p>Temperature: ${weather.temperature_2m}°C</p>
              <p>Humidity: ${weather.relative_humidity_2m}%</p>
              <p>Wind Speed: ${weather.wind_speed_10m} km/h</p>
              <p>Wind Direction: ${weather.wind_direction_10m}°</p>`);
  });

});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});