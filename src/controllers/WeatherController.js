import { searchCity, getWeather } from "../models/WeatherModel.js";
import { renderWeather, renderSearchForm } from "../views/WeatherView.js";

// Wrap the browser's callback-based geolocation API in a Promise.
export function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                reject(new Error(
                    error.code === 3
                        ? "Location request timed out. Please enable location services and try again."
                        : "Could not access your location. Please allow location access."
                ));
            },
            {
                // Limit the wait and allow a recently cached position.
                timeout: 10000,
                maximumAge: 60000
            }
        );
    });
}

// Load weather for the user's current location and update the view.
export async function loadWeather() {
    const locationLabel = document.getElementById("location-label");
    const weatherContent = document.getElementById("weather-content");

    try {
        weatherContent.innerHTML =
            '<p class="status-message">Loading weather...</p>';

        const location = await getUserLocation();
        const weather = await getWeather(
            location.latitude,
            location.longitude
        );

        locationLabel.textContent = "Your Location";
        renderWeather({ name: "Your Location" }, weather);
    } catch (error) {
        // Don't replace a forecast that has already been rendered.
        if (!weatherContent.querySelector(".weather-hero")) {
            weatherContent.textContent = "";

            const message = document.createElement("p");
            message.className = "status-message error-message";
            message.textContent = error.message;
            weatherContent.appendChild(message);

            locationLabel.textContent = "Location unavailable";
        }
    }
}

// Connect the city search form to the model and weather view.
export function setupCitySearch() {
    renderSearchForm();

    const form = document.getElementById("search-form");
    const input = document.getElementById("city-input");
    const locationLabel = document.getElementById("location-label");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const cityName = input.value.trim();
        if (!cityName) return;

        const status = document.getElementById("weather-status");
        status.textContent = "Searching for city...";

        try {
            const city = await searchCity(cityName);

            if (!city) {
                status.textContent = "City not found. Try another name.";
                return;
            }

            const weather = await getWeather(
                city.latitude,
                city.longitude
            );

            locationLabel.textContent = city.name;
            renderWeather(city, weather);
            status.textContent = "";
        } catch (error) {
            status.textContent =
                error.message || "Could not load the weather.";
        }
    });
}