import { renderCitySearchForm } from "../components/molecules/CitySearchForm.js";
import { renderCurrentWeather } from "../components/organisms/CurrentWeather.js";
import { renderForecastList } from "../components/organisms/ForecastList.js";
import { renderDailyDetails } from "../components/organisms/DailyDetails.js";

export function renderSearchForm() {
    const app = document.getElementById("app");
    app.innerHTML = renderCitySearchForm();
}

export function renderWeather(location, weather) {
    const app = document.getElementById("weather-content");
    const daily = weather.daily;

    app.innerHTML = `
        ${renderCurrentWeather(daily, location.name)}
        ${renderForecastList(daily)}
        ${renderDailyDetails(daily, 0)}
    `;

    function showDay(index) {
        document.querySelectorAll(".forecast-card").forEach((card) => {
            card.setAttribute(
                "aria-pressed",
                String(Number(card.dataset.day) === index)
            );
        });

        const detailsContainer = document.querySelector(".daily-details");
        detailsContainer.outerHTML = renderDailyDetails(daily, index);
    }

    document.querySelectorAll(".forecast-card").forEach((card) => {
        card.addEventListener("click", () => {
            showDay(Number(card.dataset.day));
        });
    });

    showDay(0);
}