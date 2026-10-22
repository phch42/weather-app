function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if ([1, 2].includes(code)) return "🌤️";
    if (code === 3) return "☁️";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return "🌡️";
}

export function renderSearchForm() {
    const app = document.getElementById("app");

    app.innerHTML = `
        <form class="search-form" id="search-form">
            <input
                type="text"
                id="city-input"
                placeholder="Enter a city..."
                aria-label="City name"
                required
            >
            <button type="submit">Search</button>
        </form>
        <p class="status-message" id="weather-status">
            Search for a city to see its forecast.
        </p>

        <div id="weather-content"></div>
    `;
}

export function renderWeather(location, weather) {
    const app = document.getElementById("weather-content");
    const daily = weather.daily;

    app.innerHTML = `
        <section class="weather-hero">
            <h2>Today's Weather in ${location.name}</h2>
            <div class="current-icon">${getWeatherIcon(daily.weather_code[0])}</div>
            <p class="current-temperature">
                ${Math.round(daily.temperature_2m_max[0])}°
            </p>
            <p class="weather-summary">Today's forecast · High temperature</p>

            <div class="weather-metrics">
                <div class="metric">
                    <span class="metric-label">Wind speed</span>
                    <span class="metric-value">${daily.wind_speed_10m_max[0]} km/h</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Wind direction</span>
                    <span class="metric-value">${daily.wind_direction_10m_dominant[0]}°</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Precipitation</span>
                    <span class="metric-value">${daily.precipitation_sum[0]} mm</span>
                </div>
            </div>
        </section>

        <section class="forecast-section">
            <div class="section-heading">
                <h2>5-Day Forecast</h2>
                <span class="location-label">Select a day for details</span>
            </div>
            <div class="forecast-grid">
                ${daily.time.map((date, index) => `
                    <button class="forecast-card"
                        data-day="${index}"
                        aria-pressed="${index === 0}"
                        type="button">
                        <h3>${index === 0 ? "Today" :
                            new Date(`${date}T12:00:00`).toLocaleDateString(
                                "en", { weekday: "short" }
                            )}</h3>
                        <div class="forecast-icon">
                            ${getWeatherIcon(daily.weather_code[index])}
                        </div>
                        <p class="forecast-temperatures">
                            ${Math.round(daily.temperature_2m_max[index])}° /
                            ${Math.round(daily.temperature_2m_min[index])}°
                        </p>
                        <p class="forecast-precipitation">
                            💧 ${daily.precipitation_sum[index]} mm
                        </p>
                    </button>
                `).join("")}
            </div>
        </section>

        <section class="daily-details" aria-live="polite">
            <h2 id="details-title">Today's Details</h2>
            <div class="details-list" id="details-list"></div>
        </section>
    `;

    function showDay(index) {
        document.querySelectorAll(".forecast-card").forEach((card) => {
            card.setAttribute(
                "aria-pressed",
                String(Number(card.dataset.day) === index)
            );
        });

        document.getElementById("details-title").textContent =
            `${index === 0 ? "Today's" : new Date(
                `${daily.time[index]}T12:00:00`
            ).toLocaleDateString("en", { weekday: "long" })} Details`;

        document.getElementById("details-list").innerHTML = `
            <div class="detail-row">
                <span>Weather</span>
                <strong>${getWeatherIcon(daily.weather_code[index])}
                    Code ${daily.weather_code[index]}</strong>
            </div>
            <div class="detail-row">
                <span>High / Low</span>
                <strong>${daily.temperature_2m_max[index]}° / ${daily.temperature_2m_min[index]}°C</strong>
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
        `;
    }

    document.querySelectorAll(".forecast-card").forEach((card) => {
        card.addEventListener("click", () => {
            showDay(Number(card.dataset.day));
        });
    });

    showDay(0);
}
