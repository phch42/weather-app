import { searchCity, getWeather } from "../models/WeatherModel.js";
import { renderWeather, renderSearchForm } from "../views/WeatherView.js";

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
                timeout: 10000,
                maximumAge: 60000
            }
        );
    });
}

export async function loadWeather() {
    const app = document.getElementById("app");
    const locationLabel = document.getElementById("location-label");

    try {
        document.getElementById("weather-content").innerHTML =
            '<p class="status-message">Loading weather...</p>';

        const location = await getUserLocation();
        const weather = await getWeather(
            location.latitude,
            location.longitude
        );

        locationLabel.textContent = "Your Location";
        renderWeather({ name: "Your Location" }, weather);
    } catch (error) {
        document.getElementById("weather-content").innerHTML = `
            <p class="status-message error-message">
             ${error.message}
            </p>
`;
        locationLabel.textContent = "Location unavailable";
    }
}


export function setupCitySearch() {
    renderSearchForm();

    const form = document.getElementById("search-form");
    const input = document.getElementById("city-input");

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

            const weather = await getWeather(city.latitude, city.longitude);
            document.getElementById("location-label").textContent = city.name;

            renderWeather(city, weather);
        } catch (error) {
            status.textContent = error.message || "Could not load the weather.";
        }
    });
}