# WeatherCast

WeatherCast is a simple weather forecast web application that allows users to get accurate updates on temperature, humidity, wind speed, and more. It helps users plan their day effectively with real-time weather information.

## Features

- **Progressive Web App (PWA):** Seamlessly use WeatherCast. Install it on your device for quick access and an app-like experience from your home screen.
- **Real-time Weather Updates**: Get accurate and up-to-date weather information for your location.
- **Detailed Forecast**: View detailed forecasts for the next 5 days, including temperature, precipitation probability, wind speed, and more.
- **Dynamic Search**: Easily search for weather forecasts by entering a city name.
- **Responsive Design:** WeatherCast adapts to various screen sizes, providing a seamless experience across devices.
- **Dark Mode**: Toggle between light and dark mode for better readability.

## Technologies Used

- HTML
- CSS
- JavaScript
- OpenWeatherMap API

### Location-Based Weather

The app can automatically fetch weather information based on the user's current location. If the browser supports geolocation, the app will prompt the user for permission to access their location. If granted, it will retrieve and display the weather details for their current coordinates.

To use this feature, simply allow the browser to access your location when prompted.

## How to Use

1. Open the app in a supported web browser.
2. Allow location access when prompted.
3. Alternatively, manually enter the name of a city in the search bar to get weather information for that location.
4. Explore the current weather conditions and the forecast.

## Live Demo

Explore WeatherCast live demo, [https://weathercast.glitch.me](https://weathercast.glitch.me)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following:

- **OpenWeatherMap API Key:** Obtain your API key from [https://openweathermap.org/api](https://openweathermap.org/api).

- **Modern Web Browser:** Ensure you have a browser that supports the app.

- **Internet Connection:** Required for fetching weather and forecast data.

### Installation

Follow these steps to run WeatherCast locally:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/LakhindarPal/WeatherCast.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd WeatherCast
   ```
   
3. **Fill the API Key:**
   Open the `main.js` file go to line 15 and fill in your OpenWeatherMap API Key.
[const apiKey = "REPLACE_WITH_YOUR_API_KEY";](https://github.com/LakhindarPal/WeatherCast/blob/main/main.js#L15)

4. **Open the App:** Open the `index.html` file in your preferred web browser.

Now, you should have WeatherCast up and running locally.

## Contributing

Contributions are welcome! If you have any suggestions or find any issues, feel free to [open an issue](https://github.com/LakhindarPal/WeatherCast/issues) or submit a [pull request](https://github.com/LakhindarPal/WeatherCast/pulls).

## License

This project is licensed under the [MIT License](LICENSE).