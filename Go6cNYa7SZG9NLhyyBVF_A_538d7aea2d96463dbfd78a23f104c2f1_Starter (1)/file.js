// main.js

// Configuration
const CITIES_DATA_URL = 'file.json';
const TIMER7_API_URL = 'http://www.7timer.info/bin/api.pl';

document.addEventListener('DOMContentLoaded', () => {
    const cityDropdown = document.getElementById('cityDropdown');
    const getWeatherButton = document.getElementById('getWeatherButton');
    const weatherOutputDiv = document.getElementById('weatherOutput');

    let selectedCity;

    // --- Helper Functions ---

    async function fetchJson(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("Content Type: ", response.headers.get('Content-Type'));
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            displayErrorMessage(`Failed to fetch data. Check console for details.`);
            return null;
        }
    }

    function displayErrorMessage(message) {
        weatherOutputDiv.textContent = `Error: ${message}`;
    }

    async function getWeather(latitude, longitude) {
        weatherOutputDiv.textContent = 'Loading weather data...'; // Set loading message
        const apiUrl = `${TIMER7_API_URL}?lon=${longitude}&lat=${latitude}&product=astro&output=json`;

        const weatherData = await fetchJson(apiUrl);

        if (weatherData) {
            displayWeather(weatherData);
        } else {
            displayErrorMessage('Failed to fetch weather data.');
        }
    }

    // Display weather data + Image
    function displayWeather(weatherData) {
        weatherOutputDiv.innerHTML = ''; // Clear previous content

        if (weatherData && weatherData.dataseries && weatherData.dataseries.length > 0) {
            const currentWeather = weatherData.dataseries[0];

            // Extract relevant data from 7Timer API
            const weatherCondition = currentWeather.weather; // Example: 'pcloudy', 'mcloudy', etc.
            const weatherSymbol = getWeatherSymbol(weatherCondition);
            const conditionElement = document.createElement('p');
            conditionElement.textContent = `Conditions: ${weatherCondition} ${weatherSymbol}`;
            weatherOutputDiv.appendChild(conditionElement);

            //const temperature = currentWeather.temp2m;
            //Create elements to display weather information
            //const temperatureElement = document.createElement('p');
            //temperatureElement.textContent = `Temperature: ${temperature}°C`;

            // Append elements to the output div
            //weatherOutputDiv.appendChild(temperatureElement);
          ;
        } else {
            displayErrorMessage("No weather data available.");
        }
    }

    // Mapping of weather conditions from 7Timer to image filenames
    function getWeatherSymbol(weatherCondition) {
        // This is what the mapping needs to occur with.
        //   This is a VERY basic example. Expand this based on the values in weatherCondition
        const weatherMap = {
            clear: '☀️', // Example
            pcloudy: '⛅', //Example
            mcloudy: '☁️', //Example
            cloudy: ' ☁️', //Example
            rain: '🌧️', //Example
            default: '❓' // Example fallback
        };

        return weatherMap[weatherCondition] || weatherMap['default'];
    }

    async function populateCityDropdown() {
        const cities = await fetchJson(CITIES_DATA_URL);

        if (cities) {
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = JSON.stringify({ city: city.city, lat: city.latitude, lon: city.longitude });
                option.textContent = city.city;
                cityDropdown.appendChild(option);
            });
        } else {
            displayErrorMessage('Failed to load city data.');
        }
    }

    getWeatherButton.addEventListener('click', () => {
        weatherOutputDiv.textContent = 'Loading weather data...';
        try {
            selectedCity = JSON.parse(cityDropdown.value);
            const latitude = selectedCity.lat;
            const longitude = selectedCity.lon;
            getWeather(latitude, longitude);
        } catch (error) {
            console.error('Error processing dropdown value:', error);
            displayErrorMessage('Invalid city selection. Please try again.');
        }
    });

    populateCityDropdown();

  // Get the first city selected
    let options = cityDropdown.querySelectorAll('option');
    if(options.length > 0){
        selectedCity = JSON.parse(options[0].value);
    }
});