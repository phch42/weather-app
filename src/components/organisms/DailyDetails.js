import { getWeatherIcon } from "../atoms/WeatherIcon.js";

export function renderDailyDetails(daily, index) {
    const dayName = index === 0
        ? "Today's"
        : new Date(`${daily.time[index]}T12:00:00`)
            .toLocaleDateString("en", { weekday: "long" }) + "'s";

    return `
        <section class="daily-details" aria-live="polite">
            <h2 id="details-title">${dayName} Details</h2>
            <div class="details-list" id="details-list">
                <div class="detail-row">
                    <span>Weather</span>
                    <strong>
                        ${getWeatherIcon(daily.weather_code[index])}
                        Code ${daily.weather_code[index]}
                    </strong>
                </div>
                <div class="detail-row">
                    <span>High / Low</span>
                    <strong>
                        ${daily.temperature_2m_max[index]}° /
                        ${daily.temperature_2m_min[index]}°C
                    </strong>
                </div>
                <div class="detail-row">
                    <span>Maximum wind</span>
                    <strong>${daily.wind_speed_10m_max[index]} km/h</strong>
                </div>
                <div class="detail-row">
                    <span>Wind direction</span>
                    <strong>${daily.wind_direction_10m_dominant[index]}°</strong>
                </div>
                <div class="detail-row">
                    <span>Precipitation</span>
                    <strong>${daily.precipitation_sum[index]} mm</strong>
                </div>
                <div class="detail-row">
                    <span>Rain / showers</span>
                    <strong>${daily.rain_sum[index]} / ${daily.showers_sum[index]} mm</strong>
                </div>
                <div class="detail-row">
                    <span>Snowfall</span>
                    <strong>${daily.snowfall_sum[index]} cm</strong>
                </div>
            </div>
        </section>
    `;
}
