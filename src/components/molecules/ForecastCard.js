import { getWeatherIcon } from "../atoms/WeatherIcon.js";
import { renderTemperature } from "../atoms/Temperature.js";

export function renderForecastCard(daily, index) {
    const date = daily.time[index];
    const dayName = index === 0
        ? "Today"
        : new Date(`${date}T12:00:00`).toLocaleDateString(
            "en",
            { weekday: "short" }
        );

    return `
        <button class="forecast-card"
            data-day="${index}"
            aria-pressed="${index === 0}"
            type="button">
            <h3>${dayName}</h3>
            <div class="forecast-icon">
                ${getWeatherIcon(daily.weather_code[index])}
            </div>
            <p class="forecast-temperatures">
                ${renderTemperature(daily.temperature_2m_max[index])} /
                ${renderTemperature(daily.temperature_2m_min[index])}
            </p>
            <p class="forecast-precipitation">
                💧 ${daily.precipitation_sum[index]} mm
            </p>
        </button>
    `;
}
