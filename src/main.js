import { searchCity, getWeather } from "./models/WeatherModel.js";

const city = await searchCity("Aalborg");

console.log("City:", city);

if (city) {
    const weather = await getWeather(city.latitude, city.longitude);

    console.log("Weather forecast:", weather);
}