
// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const minElement = document.querySelector(".temperature-min p");
const maxElement = document.querySelector(".temperature-max p");
const locationElement = document.querySelector(".location p");
const locationLon = document.querySelector(".location-lon p");
const locationLat = document.querySelector(".location-lat p");
const notificationElement = document.querySelector(".notification");
const windElement = document.querySelector(".wind p");
const humidityElement = document.querySelector(".humidity p");
const sunriseElement = document.querySelector(".sunrise p");
const sunsetElement = document.querySelector(".sunset p");

// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

// API KEY
const key = "8825c2a572ec8b70e51943a21a1e829e";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Il tuo Browser non supporta la geolocalizzazione, forse dovresti aggiornarlo!</p>";
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// GET WEATHER FROM API PROVIDER - lat/lon
function getWeather(latitude, longitude){
    let api = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + key + '&units=metric&lang=it';

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
          weather.temperature.value = Math.floor(data.main.temp);
          weather.temperature.min = Math.floor(data.main.temp_min);
          weather.temperature.max = Math.floor(data.main.temp_max);
          weather.description = data.weather[0].description;
          weather.iconId = data.weather[0].icon;
          weather.city = data.name;
          weather.country = data.sys.country;
          weather.longitude = data.coord.lon;
          weather.latitude = data.coord.lat;
          weather.wind = data.wind.speed;
          weather.humidity = data.main.humidity;

          let sunrise = new Date( data.sys.sunrise * 1000 ) ;
          let sunset = new Date( data.sys.sunset * 1000 );
           weather.sunrise = ( sunrise.getHours() + ":" + sunrise.getMinutes() );
           weather.sunset = ( sunset.getHours() + ":" + sunset.getMinutes() );

        })
        .then(function(){
            displayWeather();
        });
}

// GET WEATHER FROM API PROVIDER - city
$(function(){
	$("#request").submit(function(){
		getWeatherByCity( $("#city").val() );
		return false;
	});
});

function getWeatherByCity(request){
  let api2 = 'https://api.openweathermap.org/data/2.5/weather?appid=' + key + '&units=metric&lang=it&q=';

  fetch(api2 + request)
      .then(function(response){
          let data = response.json();
          return data;
      })
      .then(function(data){
          weather.temperature.value = Math.floor(data.main.temp);
          weather.temperature.min = Math.floor(data.main.temp_min);
          weather.temperature.max = Math.floor(data.main.temp_max);
          weather.description = data.weather[0].description;
          weather.iconId = data.weather[0].icon;
          weather.city = data.name;
          weather.country = data.sys.country;
          weather.longitude = data.coord.lon;
          weather.latitude = data.coord.lat;
          weather.wind = data.wind.speed;
          weather.humidity = data.main.humidity;

          var sunrise = new Date( data.sys.sunrise * 1000 ) ;
          var sunset = new Date( data.sys.sunset * 1000 );
           weather.sunrise = ( sunrise.getHours() + ":" + sunrise.getMinutes() );
           weather.sunset = ( sunset.getHours() + ":" + sunset.getMinutes() );
      })
      .then(function(){
          displayWeather();
      });

     // DISPLAY ERROR
      $.ajax({
		dataType: "json",
		url: api2 + request,
		data: "",
		statusCode: {
			400: function(){
				alert( "A quanto pare la tua richiesta non è valida. Prova ad inserire un'altra città!");
			},

			404: function(){
				alert( "Non credo di conoscere quella città, sicuro di averla scritta bene?");
			}
		}
	});


};

// DISPLAY WEATHER
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}` + ` °<span>C</span>`;
    minElement.innerHTML = `${weather.temperature.min}` + ` °<span>C</span>`;
    maxElement.innerHTML = `${weather.temperature.max}` + ` °<span>C</span>`;
    descElement.innerHTML = `${weather.description}`;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    locationLon.innerHTML = `${weather.longitude}`;
    locationLat.innerHTML = `${weather.latitude}`;
    windElement.innerHTML = `${weather.wind}` + ` m/s` ;
    humidityElement.innerHTML = ` ${weather.humidity}` + `%` ;
    sunriseElement.innerHTML = `${weather.sunrise}`;
    sunsetElement.innerHTML = `${weather.sunset}`;
}
