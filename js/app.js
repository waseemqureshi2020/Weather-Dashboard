// 1. Setup API credentials
const API_KEY = '2b60bd8d0b8d3cf404fb3573d646cac3';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// 2. Select DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherResult = document.getElementById('weather-result');
const errorMessage = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading');

// 3. The Main Function (Async/Await)
async function getWeatherData(city) {
    // Reset UI states
    errorMessage.classList.add('hidden');
    weatherResult.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    try {
        // Fetch data from the API
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);

        // If the city isn't found (404), throw an error
        if (!response.ok) {
            throw new Error('City not found');
        }

        // Convert response to JSON
        const data = await response.json();

        // Pass the data to a function that updates the HTML
        displayWeatherData(data);

    } catch (error) {
        // Show error message if something goes wrong
        loadingSpinner.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = error.message === 'City not found' 
            ? 'City not found. Please check the spelling.' 
            : 'Something went wrong. Please try again later.';
    }
}

// 4. Function to update the UI
function displayWeatherData(data) {
    // Hide loading, show results
    loadingSpinner.classList.add('hidden');
    weatherResult.classList.remove('hidden');

    // Update DOM elements with data from the API
    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;
    
    // Get the weather icon from OpenWeatherMap
    const iconCode = data.weather[0].icon;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// 5. Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

// Allow pressing "Enter" to search
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});