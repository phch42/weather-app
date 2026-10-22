export function renderWeatherMetric(label, value) {
    return `
        <div class="metric">
            <span class="metric-label">${label}</span>
            <span class="metric-value">${value}</span>
        </div>
    `;
}