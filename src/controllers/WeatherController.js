import { getWeather } from "../models/WeatherModel.js";
import { renderWeather } from "../views/WeatherView.js";

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
        app.innerHTML = '<p class="status-message">Loading weather...</p>';

        const location = await getUserLocation();
        const weather = await getWeather(
            location.latitude,
            location.longitude
        );

        locationLabel.textContent = "Your Location";
        renderWeather({ name: "Your Location" }, weather);
    } catch (error) {
        app.innerHTML = `
            <p class="status-message error-message">
                ${error.message}
            </p>
        `;
        locationLabel.textContent = "Location unavailable";
    }
}
