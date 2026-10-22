import { renderCitySearchForm } from "../components/molecules/CitySearchForm.js";
import { renderCurrentWeather } from "../components/organisms/CurrentWeather.js";
import { renderForecastList } from "../components/organisms/ForecastList.js";
import { renderDailyDetails } from "../components/organisms/DailyDetails.js";

// Render the city search form inside the main app container.
export function renderSearchForm() {
    const app = document.getElementById("app");
    app.innerHTML = renderCitySearchForm();
}

// Combine the weather components and handle forecast-day selection.
export function renderWeather(location, weather) {
    const app = document.getElementById("weather-content");
    const daily = weather.daily;

    app.innerHTML = `
        ${renderCurrentWeather(daily, location.name)}
        ${renderForecastList(daily)}
        ${renderDailyDetails(daily, 0)}
    `;

    function showDay(index) {
        // Update the selected state for accessibility and visual feedback.
        app.querySelectorAll(".forecast-card").forEach((card) => {
            card.setAttribute(
                "aria-pressed",
                String(Number(card.dataset.day) === index)
            );
        });

        // Replace the details with weather data for the selected day.
        const detailsContainer = app.querySelector(".daily-details");
        detailsContainer.outerHTML = renderDailyDetails(daily, index);
    }

    app.querySelectorAll(".forecast-card").forEach((card) => {
        card.addEventListener("click", () => {
            showDay(Number(card.dataset.day));
        });
    });

    // Show today's details by default.
    showDay(0);
}