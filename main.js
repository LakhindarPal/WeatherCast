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

// fetch data with api endpoint
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      handleError(data);
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

// handle fetch error
function handleError(data) {
  if (data.cod == 404) {
    alert("City not found.");
  } else if (data.cod == 401) {
    alert("Invalid API key.");
  } else {
    console.error("Unhandled error:", data);
  }
}

// fetch weather 
async function fetchWeather(coords) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;
  let endpoint = coords ? `${apiUrl}&lat=${coords.latitude}&lon=${coords.longitude}` : `${apiUrl}&q=${query}`;

  const data = await fetchData(endpoint);
  if (data) displayWeather(data);
}

//display 
function displayWeather(data) {
  const { name, dt, weather, main, sys } = data;

  elements.location.innerHTML = `${name}<span> As of ${formatTime(dt)}</span>`;
  elements.mainIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  elements.mainIcon.alt = weather[0].description;
  elements.condition.textContent = weather[0].main;
  elements.temperature.textContent = `${main.temp} °C`;
  elements.sunrise.textContent = formatTime(sys.sunrise);
  elements.sunset.textContent = formatTime(sys.sunset);

  elements.detailedInfo.innerHTML = generateListInfo(data);
}

// fetch forecast
async function fetchForecast(coords) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric`;
  let endpoint = coords ? `${apiUrl}&lat=${coords.latitude}&lon=${coords.longitude}` : `${apiUrl}&q=${query}`;

  const data = await fetchData(endpoint);
  if (data) displayForecast(data);
}

// display forecast
function displayForecast(data) {
  const forecastListFragment = document.createDocumentFragment();

  data.list.forEach(item => {
    const article = document.createElement("article");

    const time = document.createElement("h3");
    time.textContent = formatDate(item.dt);
    article.appendChild(time);

    const weatherDetails = document.createElement("div");
    weatherDetails.classList.add("accordion");

    const temp = document.createElement("p");
    temp.classList.add("temp");
    temp.innerHTML = `🌡️ <span>${item.main.temp} °C</span>`;
    weatherDetails.appendChild(temp);

    const icon = document.createElement("img");
    icon.classList.add("icon");
    icon.src = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    icon.alt = item.weather[0].description;
    icon.width = 100;
    icon.height = 100;
    weatherDetails.appendChild(icon);

    const pop = document.createElement("p");
    pop.classList.add("pop");
    pop.innerHTML = `💦 <span>${item.pop} %</span>`;
    weatherDetails.appendChild(pop);

    article.appendChild(weatherDetails);

    const panel = document.createElement("ul");
    panel.classList.add("panel");

    const detailedListInfo = generateListInfo(item, true);
    panel.innerHTML = detailedListInfo;

    article.appendChild(panel);

    forecastListFragment.appendChild(article);
  });

  elements.forecastList.innerHTML = "";
  elements.forecastList.appendChild(forecastListFragment);
}

// Generate list items
function generateListInfo(data, forecast = false) {
  const { main, clouds, wind, visibility } = data;

  const detailedInfo = [
    { label: "Feels Like", value: `${main.feels_like} °C` },
    ...(forecast ? [] : [
      { label: "Temp High", value: `${main.temp_max} °C` },
      { label: "Temp Low", value: `${main.temp_min} °C` },
    ]),
    { label: "Pressure", value: `${main.pressure} hPa` },
    ...(forecast ? [] : [
      { label: "Ground Level", value: `${main.grnd_level || 1013.25} hPa` },
      { label: "Sea Level", value: `${main.sea_level || 1013.25} hPa` },
    ]),
    { label: "Wind", value: `${getWindDirection(wind.deg)} ${wind.speed} m/s` },
    { label: "Humidity", value: `${main.humidity} %` },
    { label: "Cloudiness", value: `${clouds.all} %` },
    { label: "Visibility", value: `${visibility / 1000} km` },
  ];

  return detailedInfo
    .map((info) => `<li><strong>${info.label}:</strong><span> ${info.value}</span></li>`)
    .join("");
}


// epoch time to human readable form
function formatTime(epoch) {
  const date = new Date(epoch * 1000);
  return date.toLocaleTimeString("en-IN");
}

//epoch date to human readable format
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

// wind direction based on degrees
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

//search by city name
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

// fetch weather data by co-ordinates 
function fetchWeatherByCoords(position) {
  fetchWeather(position.coords);
  fetchForecast(position.coords);
}

document.addEventListener("DOMContentLoaded", function() {
  getLocation();
});