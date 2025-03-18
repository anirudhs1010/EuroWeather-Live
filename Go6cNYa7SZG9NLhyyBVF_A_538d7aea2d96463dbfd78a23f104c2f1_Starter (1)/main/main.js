document.addEventListener('DOMContentLoaded', function() {
    const cityDropdown = document.getElementById('cityDropdown');
    const getWeatherButton = document.getElementById('getWeatherButton');
    const weatherOutputDiv = document.getElementById('weatherOutput');

    function populateDropdown() {
    try {
      fetch('file.json')
        .then(response => response.json())
        .then(cities => {
          cities.forEach(city => {
            const option = document.createElement('option');
            option.value = JSON.stringify({ lat: city.latitude, lon: city.longitude });
            option.textContent = city.city;
            cityDropdown.appendChild(option);
          });
        })
        .catch(error => console.error("Error loading cities:", error));
        } catch (error) {
            console.error("General Error populating")
    }
    }

   async function getWeather(latitude, longitude) {
    try {
      const apiUrl = `http://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=civillight&output=json`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

         const weatherData = await response.json(); // This line is now await to sync the weatherdata
      // Check if weatherData and dataseries are defined
      if (weatherData && weatherData.dataseries && Array.isArray(weatherData.dataseries)) {
        // Create a container for weather information
        let weatherInfo = '';

        // Iterate through the dataseries to display weather for each day
        weatherData.dataseries.forEach(dayData => {
          const date = dayData.date;
          const weatherCondition = dayData.weather;
          const maxTemp = dayData.temp2m.max;
          const minTemp = dayData.temp2m.min;

          let imageSrc = '';
          switch (weatherCondition) {
            case 'clear':
              imageSrc = '../images/clear.png';
              break;
            case 'mcloudy':
            case 'pcloudy':
              imageSrc = '../images/pcloudy.png';
              break;
            case 'cloudy':
              imageSrc = '../images/cloudy.png';
              break;
            case 'lightrain':
              imageSrc = '../images/tsrain.png';
              break;
            case 'lightsnow':
              imageSrc = '../images/lightsnow.png';
              break;
            case 'fog':
              imageSrc = '../images/fog.png';
              break;
            default:
                  imageSrc = '../images/unknown.png'; // Handle unknown weather conditions
              break;
          }

          // Build the weather information string
          weatherInfo += `
            <div>
              <p>Date: ${date}</p>
              <p>Max Temp: ${maxTemp}°C</p>
              <p>Min Temp: ${minTemp}°C</p>
              ${imageSrc ? `<img src="${imageSrc}" alt="${weatherCondition}" style="width: 50px; height: 50px;">` : '<p>No image available</p>'}
            </div>
            <hr>
          `;
        });

        // Display the weather information in the weatherOutputDiv
        weatherOutputDiv.innerHTML = weatherInfo;

      } else {
        weatherOutputDiv.textContent = "Weather data is not available.";
      }
       } catch (error){
        console.error("Error in the .then of weather:", error);
    }
    }

    getWeatherButton.addEventListener('click', function() {
      try {
      const selectedCity = JSON.parse(cityDropdown.value);
      const latitude = selectedCity.lat;
      const longitude = selectedCity.lon;

      getWeather(latitude, longitude);
    } catch (error){
        console.log("error on the button press");
    }
    });

    populateDropdown();
  });