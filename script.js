let cityEl = document.querySelector(".city");
let iconEl = document.querySelector(".icon");
let descriptionEl = document.querySelector(".description");
let temperatureEl = document.querySelector(".temp");
let humidityEl = document.querySelector(".humidity");
let windEl = document.querySelector(".wind");
let searchBar = document.querySelector(".search-bar");
let searchEl = document.querySelector(".search button");
let weatherEl = document.querySelector(".weather");
let locationBtn = document.querySelector(".location-auto-detect");
let feelslike_cEl = document.querySelector(".feelslike_c");
let autocompleteList = document.getElementById("autocomplete-list");
let alertsEl = document.getElementById("alerts");

let weather = {
  apikey: "f8e85b98c4dd433789c75258243006",
  fetchWeather: function(city) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${this.apikey}&q=${city}&aqi=no`)
      .then((response) => response.json())
      .then((data) => {
        this.displayWeather(data);
        this.fetchForecast(city); 
      })
      .catch((error) => console.error('Error fetching weather:', error));
  },
  displayWeather: function(data) {
    const name = data.location.name;
    const icon = data.current.condition.icon;
    const text = data.current.condition.text;
    const temp_c = data.current.temp_c; 
    const humidity = data.current.humidity; 
    const wind_kph = data.current.wind_kph;
    const feelslike_c = data.current.feelslike_c; 

    cityEl.innerText = `Weather in ${name}`;
    iconEl.src = `https:${icon}`;
    descriptionEl.innerText = text;
    temperatureEl.innerText = `Temperature: ${temp_c}°C`;
    humidityEl.innerText = `Humidity: ${humidity}%`;
    windEl.innerText = `Wind Speed: ${wind_kph} km/hr`;
    feelslike_cEl.innerText = `Feels Like: ${feelslike_c}°C`;

    weatherEl.classList.remove("loading");
  },

  fetchForecast: function(city){
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${this.apikey}&q=${city}&days=1&aqi=no&alerts=no`)
    .then((response) => response.json())
    .then((data) => this.displayForecast(data))
    .catch((error) => console.log('Error fetching forecast:', error));
  },

  displayForecast: function(data){
    const hourlyForecastEl = document.querySelector('.hourly-forecast-container');
    hourlyForecastEl.innerHTML = '';
  
    const hourlyForecasts = data.forecast.forecastday[0].hour; 
  
    hourlyForecasts.forEach((hourlyForecast) => {
      const time = hourlyForecast.time.split(' ')[1];
      const temp_c = hourlyForecast.temp_c;
      const condition = hourlyForecast.condition.text;
      const icon = hourlyForecast.condition.icon;
  
      const hourlyForecastDiv = document.createElement('div');
      hourlyForecastDiv.classList.add('hourly-forecast-item'); 
      hourlyForecastDiv.innerHTML = `
        <div>
          <h3>${time}</h3>
          <img src="https:${icon}" alt="${condition}">
          <p>${temp_c}°C</p>
        </div>
      `;
      hourlyForecastEl.appendChild(hourlyForecastDiv);
    });
  },

  search: function() {
    const searchValue = searchBar.value.trim().toLowerCase();
    this.fetchWeather(searchValue);
  },

  autocomplete: function(query) {
    fetch(`https://api.weatherapi.com/v1/search.json?key=${this.apikey}&q=${query}`)
      .then((response) => response.json())
      .then((data) => {
        autocompleteList.innerHTML = ''; 
        data.forEach((result) => {
          const listItem = document.createElement('li');
          listItem.textContent = result.name;
          listItem.addEventListener('click', () => {
            searchBar.value = result.name;
            autocompleteList.innerHTML = ''; 
            this.search();
          });
          autocompleteList.appendChild(listItem);
        });
      })
      .catch((error) => console.error('Error fetching autocomplete:', error));
  }
};


searchEl.addEventListener("click", () => {
  weather.search();
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser does not support geolocation API");
  }
});

searchBar.addEventListener("keyup", (event) => {
  const query = event.target.value.trim().toLowerCase();
  if (query.length >= 3) {
    weather.autocomplete(query);
  } else {
    autocompleteList.innerHTML = ''; 
  }

  if (event.key === "Enter") {
    weather.search();
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  weather.fetchWeather(`${latitude},${longitude}`);
}

function onError(error) {
  console.error(`Error getting location: ${error.message}`);
}

weather.fetchWeather("new delhi");
