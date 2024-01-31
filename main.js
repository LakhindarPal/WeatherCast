const getElement = (param) => document.querySelector(param);
const elements = {
  searchInput: getElement("#searchInput"),
  searchBtn: getElement("#searchBtn"),
  location: getElement("#location"),
  temperature: getElement("#temperature"),
  condition: getElement("#condition"),
  mainIcon: getElement("#main-icon"),
  sunrise: getElement("#sunrise span"),
  sunset: getElement("#sunset span"),
  detailedInfo: getElement("#details #info"),
  forecastList: getElement("#forecast #list"),
}

const apiKey = "REPLACE_WITH_YOUR_API_KEY";
let query = "New Delhi, India"; //default city

// weather 
async function fetchWeather(coords) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;

  if (coords) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}&units=metric`;
  }

  const data = await fetch(apiUrl)
    .then(res => res.json());

  if (data.cod == 404) {
    return alert("No data found.");
  }

  if (data.cod == 401) {
    return alert("Invalid API key.");
  }

  displayWeather(data);
}

//display 
function displayWeather(data) {
  elements.location.innerHTML = `${data.name}<span> As of ${formatTime(data.dt)}</span>`;
  elements.mainIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  elements.mainIcon.alt = data.weather[0].description;
  elements.condition.textContent = data.weather[0].main;
  elements.temperature.textContent = `${data.main.temp} °C`;
  elements.sunrise.textContent = formatTime(data.sys.sunrise);
  elements.sunset.textContent = formatTime(data.sys.sunset);

  elements.detailedInfo.innerHTML =
    `<li><strong>Feels Like:</strong><span> ${data.main.feels_like} °C</span></li>
    <li><strong>Temp High:</strong><span> ${data.main.temp_max} °C</span></li>
    <li><strong>Temp Low:</strong><span> ${data.main.temp_min} °C</span></li>
    <li><strong>Pressure:</strong><span> ${data.main.pressure} hPa</span></li>
    <li><strong>Ground Level:</strong><span> ${data.main.grnd_level || 1013.25} hPa</span></li>
    <li><strong>Sea Level:</strong><span> ${data.main.sea_level || 1013.25} hPa</span></li>
    <li><strong>Wind:</strong><span> ${getWindDirection(data.wind.deg)} ${data.wind.speed} m/s</span></li>
    <li><strong>Humidity:</strong><span> ${data.main.humidity} %</span></li>
    <li><strong>Cloudiness:</strong><span> ${data.clouds.all} %</span></li>
    <li><strong>Visibility:</strong><span> ${data.visibility/1000} km</span></li>`;
}

// forecast
async function fetchForecast(coords) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=metric`;

  if (coords) {
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}&units=metric`;
  }

  const data = await fetch(apiUrl)
    .then(res => res.json());

  if (data.cod == 404) {
    return alert("Please enter a valid city name!");
  }

  if (data.cod == 401) {
    return alert("Please use valid api key from https://openweathermap.org/api");
  }

  displayForecast(data);
}

// display 
function displayForecast(data) {
  elements.forecastList.innerHTML = "";

  data.list.forEach(item => {
    const article = document.createElement("article");

    const time = document.createElement("h3");
    time.textContent = formatDate(item.dt);
    article.appendChild(time);

    // Create div element for weather details
    const accordion = document.createElement("div");
    accordion.classList.add("accordion");

    // Create p element for temperature
    const temp = document.createElement("p");
    temp.classList.add("temp");
    temp.innerHTML = `🌡️ <span>${item.main.temp} °C</span>`;
    accordion.appendChild(temp);

    // Create img element for weather icon
    const icon = document.createElement("img");
    icon.classList.add("icon");
    icon.src = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    icon.alt = item.weather[0].description;
    icon.width = 100;
    icon.height = 100;
    accordion.appendChild(icon);

    // Create p element for precipitation probability
    const pop = document.createElement("p");
    pop.classList.add("pop");
    pop.innerHTML = `💦 <span>${item.pop} %</span>`;
    accordion.appendChild(pop);

    article.appendChild(accordion);

    // Create ul element for panel details
    const panel = document.createElement("ul");
    panel.classList.add("panel");

    panel.innerHTML =
      `<li><strong>Feels Like:</strong><span>${item.main.feels_like} °C</span></li>
      <li><strong>Pressure:</strong><span> ${item.main.pressure} hPa</span></li>
      <li><strong>Wind:</strong><span> ${getWindDirection(item.wind.deg)} ${item.wind.speed} m/s</span></li>
      <li><strong>Humidity:</strong><span> ${item.main.humidity} %</span></li>
      <li><strong>Cloudiness:</strong><span> ${item.clouds.all} %</span></li>
      <li><strong>Visibility:</strong><span> ${item.visibility/1000} km</span></li>`

    article.appendChild(panel);

    elements.forecastList.appendChild(article);
  });
}


// function to format time in readable form
function formatTime(epoch) {
  const date = new Date(epoch * 1000);
  return date.toLocaleTimeString("en-IN");
}

//function to format date
function formatDate(epoch) {
  const date = new Date(epoch * 1000);
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  };

  return date.toLocaleString("en-IN", options);
}

// Function to get wind direction based on degrees
function getWindDirection(degrees) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// accordion 
elements.forecastList.addEventListener("click", function(event) {
  if (event.target.classList.contains("accordion")) {
    event.target.classList.toggle("active");
    let panel = event.target.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }
});

//search
elements.searchBtn.addEventListener("click", () => {
  query = elements.searchInput.value?.trim();

  if (!query)
    return alert("Please enter a city name first !");

  fetchWeather();
  fetchForecast();
})

// Get user's current location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchWeatherByCoords);
  } else {
    console.log("Geolocation is not supported by this browser.");

    fetchWeather();
    fetchForecast();
  }
}

// Callback function to handle weather data
function fetchWeatherByCoords(position) {
  fetchWeather(position.coords);
  fetchForecast(position.coords);
}

document.addEventListener("DOMContentLoaded", function() {
  getLocation();
});