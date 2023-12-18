import { getWeather } from "./weather.mjs";
import { iconMap } from "./iconMap.mjs";


navigator.geolocation.getCurrentPosition(success, error)
function success({ coords }) {
    
  getCityName(coords.latitude, coords.longitude)
  .then(cityName => {
      console.log(`City: ${cityName}`);
      getWeather(coords.latitude, coords.longitude, Intl.DateTimeFormat().resolvedOptions().timeZone,cityName)
          .then(renderWeather);
  })
  .catch(error => console.error(error));
}
function error() {
    alert("pleease allow us to use your location")
}
function getCityName(latitude, longitude) {
  // Make an API request to Nominatim for reverse geocoding
  const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  return fetch(nominatimApiUrl)
      .then(response => response.json())
      .then(data => {
          // Extract the city name from the Nominatim response
          const city = data.address?.city;

          return city || 'Unknown';
      });
}



function renderWeather({ current, daily, hourly,city }) {
    console.log(city );
  renderCurrentWeather(current,city);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove("blurred");
}

function setValue(selector, value) {
  document.querySelector(`[data-${selector}]`).textContent = value;
}
function getIconUrl(iconCode) {
  return `icons/${iconMap.get(iconCode)}.svg`;
}
const currentIcon = document.querySelector("[data-current-icon]");
function renderCurrentWeather(current,city) {
  currentIcon.src = getIconUrl(current.weatherCode);
  setValue("current-temp", current.currentTemp);
  setValue("city", city);
  setValue("current-high", current.highTemp);
  setValue("current-fl-high", current.lowTemp);
  setValue("current-fl-low", current.lowfeelsLike);
  setValue("current-low", current.lowTemp);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
}
const dayFormat = new Intl.DateTimeFormat(undefined, { weekday: "long" });
function renderDailyWeather(daily) {
  const dailySection = document.querySelector(".day-section");
  dailySection.innerHTML = daily
    .map((day) => {

      return `
        <div class="day-card">
        <img src=${getIconUrl(day.iconCode)} class="weather-icon" />
        <div class="day-card-date">${dayFormat.format(day.timestamp)}</div>
        <div>${day.maxTemp}&deg;</div>
      </div>
        `;
    })
    .join("");
}
const hourFormat = new Intl.DateTimeFormat(undefined, {hour:"numeric"})
function renderHourlyWeather(hourly) {
    const hourSection = document.querySelector("[data-hour-section]")
    hourSection.innerHTML = hourly.map(hour => {
        return `
        <tr class="hour-row">
          <td>
            <div class="info-group">
              <div class="label">${dayFormat.format(hour.timestamp)}</div>
              <div>${hourFormat.format(hour.timestamp)}</div>
            </div>
          </td>
          <td>
            <img src=${getIconUrl(hour.iconCode)} class="weather-icon" />
          </td>
          <td>
            <div class="info-group">
              <div class="label">temp</div>
              <div>${hour.temp}&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">fl temp</div>
              <div>${hour.feelsLike}&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">wind</div>
              <div>${hour.windSpeed} <span class="value-sub-info">KM/h</span></div>
            </div>
          </td>
          <td>
              <div class="info-group">
              <div class="label">percip</div>
              <div>${hour.percip} <span class="value-sub-info">mm</span></div>
            </div>
          </td>
        </tr>
        `;
    }).join("")
}
