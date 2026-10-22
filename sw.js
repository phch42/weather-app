const STATIC_CACHE = "weather-static-v2";
const API_CACHE = "weather-api-v1";

const STATIC_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./assets/icons/weather.svg",
    "./assets/css/style.css",
    "./src/main.js",
    "./src/models/WeatherModel.js",
    "./src/views/WeatherView.js",
    "./src/controllers/WeatherController.js",
    "./src/components/atoms/WeatherIcon.js",
    "./src/components/atoms/Temperature.js",
    "./src/components/atoms/WeatherMetric.js",
    "./src/components/molecules/ForecastCard.js",
    "./src/components/molecules/CitySearchForm.js",
    "./src/components/organisms/CurrentWeather.js",
    "./src/components/organisms/ForecastList.js",
    "./src/components/organisms/DailyDetails.js"
];

// Pre-cache the app's static files.
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(STATIC_FILES))
            .then(() => self.skipWaiting())
    );
});

// Delete outdated caches while preserving the current static and API caches.
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames
                    .filter((name) =>
                        name !== STATIC_CACHE && name !== API_CACHE
                    )
                    .map((name) => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

// Use Network First for API requests and Cache First for static files.
self.addEventListener("fetch", (event) => {
    const request = event.request;

    // Only cache GET requests; other methods may modify server data.
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    const isWeatherAPI =
        url.hostname === "api.open-meteo.com" ||
        url.hostname === "geocoding-api.open-meteo.com";

    if (isWeatherAPI) {
        // Network First: try the network, then use cached data if offline.
        event.respondWith(
            fetch(request)
                .then(async (response) => {
                    if (response.ok) {
                        try {
                            const responseToCache = response.clone();
                            const cache = await caches.open(API_CACHE);
                            await cache.put(request, responseToCache);
                        } catch (error) {
                            console.error(
                                "Could not cache API response:",
                                error
                            );
                        }
                    }

                    return response;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(request);

                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return new Response(
                        JSON.stringify({
                            error: "You are offline and no cached forecast is available."
                        }),
                        {
                            status: 503,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    );
                })
        );

        return;
    }

    // Cache First: use cached static files, or fetch and cache them.
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request).then(async (response) => {
                    if (response.ok && url.origin === self.location.origin) {
                        try {
                            const responseToCache = response.clone();
                            const cache = await caches.open(STATIC_CACHE);
                            await cache.put(request, responseToCache);
                        } catch (error) {
                            console.error(
                                "Could not cache static file:",
                                error
                            );
                        }
                    }

                    return response;
                });
            })
    );
});