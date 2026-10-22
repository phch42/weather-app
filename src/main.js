import {
    loadWeather,
    setupCitySearch
} from "./controllers/WeatherController.js";

// Set up the city search and load the user's local weather.
setupCitySearch();
loadWeather();

// Register the service worker for caching and offline support.
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(() => {
                console.log("Service worker registered");
            })
            .catch((error) => {
                console.error(
                    "Service worker registration failed:",
                    error
                );
            });
    });
}