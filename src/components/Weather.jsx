import React, { useEffect, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import sun_icon from '../assets/sun.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.jpg';

// ✅ React Icons
import { 
  FaTemperatureLow, 
  FaTemperatureHigh, 
  FaCompressArrowsAlt, 
  FaEye, 
  FaSun, 
  FaMoon, 
  FaThermometerHalf 
} from "react-icons/fa";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");

  const search = async (cityName) => {
    if (!cityName) return;
    try {
      const apiKey = 'eeed221b9e1d5e798c923bdc63f6a7ca';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData({
          humidity: data.main.humidity,
          windspeed: (data.wind.speed * 3.6).toFixed(1),
          temperature: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          temp_min: Math.round(data.main.temp_min),
          temp_max: Math.round(data.main.temp_max),
          pressure: data.main.pressure,
          visibility: (data.visibility / 1000).toFixed(1),
          condition: data.weather[0].description,
          sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
          sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
          location: `${data.name}, ${data.sys.country}`,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        });
      } else {
        alert(data.message || "City not found!");
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  // Default city when page loads
  useEffect(() => {
    search("London");
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search(city);
    }
  };

  return (
    <div className='Weather'>
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder='Search city'
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
          {/* Main Weather Info */}
          <img src={weatherData.icon || sun_icon} alt="Weather Icon" className='Weather-icon' />
          <p className='temperature'>{weatherData.temperature}°C</p>
          <p className='location'>{weatherData.location}</p>
          <p className='condition'>{weatherData.condition}</p>

          {/* All Details Container (3 Rows) */}
          <div className="all-details">

            {/* Row 1: Humidity + Wind */}
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

            {/* Row 2 & 3: Extra Details */}
            <div className="extra-details">
              <div className="detail-card">
                <FaThermometerHalf />
                <p><b>Feels Like:</b> {weatherData.feels_like}°C</p>
              </div>
              <div className="detail-card">
                <FaTemperatureLow />
                <p><b>Min:</b> {weatherData.temp_min}°C</p>
              </div>
              <div className="detail-card">
                <FaTemperatureHigh />
                <p><b>Max:</b> {weatherData.temp_max}°C</p>
              </div>
              <div className="detail-card">
                <FaCompressArrowsAlt />
                <p><b>Pressure:</b> {weatherData.pressure} hPa</p>
              </div>
              <div className="detail-card">
                <FaEye />
                <p><b>Visibility:</b> {weatherData.visibility} km</p>
              </div>
              <div className="detail-card">
                <FaSun />
                <p><b>Sunrise:</b> {weatherData.sunrise}</p>
              </div>
              <div className="detail-card">
                <FaMoon />
                <p><b>Sunset:</b> {weatherData.sunset}</p>
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

export default Weather;
