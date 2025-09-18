import React, { useEffect, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import sun_icon from '../assets/sun.png'
import humidity_icon from '../assets/humidity.png'
import wind_icon from '../assets/wind.jpg'

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("London");

  const search = async (cityName) => {
    if (!cityName) return;
    try {
      const apiKey = 'eeed221b9e1d5e798c923bdc63f6a7ca'; // ✅ Read from .env
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("API Response:", data);

      if (data.cod === 200) {
        setWeatherData({
          humidity: data.main.humidity,
          windspeed: (data.wind.speed * 3.6).toFixed(1), // m/s → km/h
          temperature: Math.round(data.main.temp),
          location: data.name,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        });
      } else {
        alert(data.message || "City not found!");
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  // Default: show London weather
  useEffect(() => {
    search(city);
  }, []);

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search(city);
    }
  };

  return (
    <div className='Weather'>
      <div className="search-bar">
        <input
          type="text"
          placeholder='Search'
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <img
          src={search_icon}
          alt="Search"
          onClick={() => search(city)}
        />
      </div>

      {weatherData ? (
        <>
          <img src={weatherData.icon || sun_icon} alt="Weather Icon" className='Weather-icon' />
          <p className='temperature'>{weatherData.temperature}°C</p>
          <p className='location'>{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind" />
              <div>
                <p>{weatherData.windspeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p style={{ color: "#fff" }}>Loading...</p>
      )}
    </div>
  )
}

export default Weather
