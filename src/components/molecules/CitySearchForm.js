export function renderCitySearchForm() {
    return `
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