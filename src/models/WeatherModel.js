const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

// Convert a city name into geographic coordinates.
export async function searchCity(city) {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not search for the city.");
    }

    const data = await response.json();

    return data.results?.[0] ?? null;
}

// Fetch five days of weather data for the given coordinates.
export async function getWeather(latitude, longitude) {
    const params = new URLSearchParams({
        latitude,
        longitude,
        daily: "weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_sum,rain_sum,showers_sum,snowfall_sum",
        timezone: "auto",
        forecast_days: "5"
    });

    const response = await fetch(`${WEATHER_API}?${params}`);

    if (!response.ok) {
        const error = await response.json();
        console.error("Open-Meteo error:", error);
        throw new Error("Could not fetch the weather forecast.");
    }

    return response.json();
}