import { getWeatherIcon } from "../atoms/WeatherIcon.js";
import { renderTemperature } from "../atoms/Temperature.js";
import { renderWeatherMetric } from "../atoms/WeatherMetric.js";

export function renderCurrentWeather(daily, locationName) {
    return `
        <section class="weather-hero">
            <h2>Today's Weather in ${locationName}</h2>
            <div class="current-icon">
                ${getWeatherIcon(daily.weather_code[0])}
            </div>
            <p class="current-temperature">
                ${renderTemperature(daily.temperature_2m_max[0])}C
            </p>
            <p class="weather-summary">
                Today's high temperature
            </p>

            <div class="weather-metrics">
                ${renderWeatherMetric(
                    "Wind speed",
                    `${daily.wind_speed_10m_max[0]} km/h`
                )}
                ${renderWeatherMetric(
                    "Wind direction",
                    `${daily.wind_direction_10m_dominant[0]}°`
                )}
                ${renderWeatherMetric(
                    "Precipitation",
                    `${daily.precipitation_sum[0]} mm`
                )}
            </div>
        </section>
    `;
}