import { renderForecastCard } from "../molecules/ForecastCard.js";

export function renderForecastList(daily) {
    return `
        <section class="forecast-section">
            <div class="section-heading">
                <h2>5-Day Forecast</h2>
                <span class="location-label">
                    Select a day for details
                </span>
            </div>
            <div class="forecast-grid">
                ${daily.time.map((_, index) =>
                    renderForecastCard(daily, index)
                ).join("")}
            </div>
        </section>
    `;
}