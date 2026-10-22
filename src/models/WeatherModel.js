const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

export async function searchCity (city) {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not search for the city.");
    }

    const data = await response.json();

    return data.results?.[0] ?? null;
}

export async function getWeather(latitude, longitude) {
    const params = new URLSearchParams({
        latitude,
        longitude,
        daily: "weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_sum,rain_sum,showers_sum,snowfall_sum",
        hourly: "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,precipitation,rain,showers,snowfall",
        timezone: "auto",
        forecast_days: "5"
    });

    const response = await fetch(`${WEATHER_API}?${params}`);

    if (!response.ok) {
        const error = await response.json();
        console.error("Open-Meteo error:", error)
        throw new Error("Could not fetch the weather forecast.");
    }

    return await response.json();
}