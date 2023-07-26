import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isDarkTheme, setDarkTheme] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');

  const API_KEY = '0b7556c97615ce9b52b0199435ec78ae';

  useEffect(() => {
    if (city && country) {
      fetchWeatherData();
    }
  }, [city, country]);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    }
  };

  const toggleFavorite = () => {
    if (favorites.includes(city)) {
      setFavorites(favorites.filter(favCity => favCity !== city));
    } else {
      setFavorites([...favorites, city]);
    }
  };

  const handleTemperatureChange = () => {
    setTemperatureUnit(prevUnit => (prevUnit === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const handleThemeChange = () => {
    setDarkTheme(prevTheme => !prevTheme);
  };

  const renderWeatherData = () => {
    if (weatherData) {
      const { main, name, sys, weather } = weatherData;
      const temperature = temperatureUnit === 'celsius' ? main.temp - 273.15 : (main.temp - 273.15) * 1.8 + 32;

      return (
        <div className="weather-card">
          <h2>{name}, {sys.country}</h2>
          <p>Temperature: {temperature.toFixed(2)} {temperatureUnit === 'celsius' ? '°C' : '°F'}</p>
          <p>Weather: {weather[0].description}</p>
          <button onClick={toggleFavorite}>{favorites.includes(city) ? 'Unmark as Favorite' : 'Mark as Favorite'}</button>
        </div>
      );
    } else {
      return <p>No weather data found for the specified city and country.</p>;
    }
  };

  return (
    <div className={`App ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <div className="header">
        <h1>Celebal Weather App</h1>
        <div className="theme-button" onClick={handleThemeChange}>
          {isDarkTheme ? 'Light Theme' : 'Dark Theme'}
        </div>
      </div>
      <div className="search-container">
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter City" />
        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Enter Country" />
        <button onClick={fetchWeatherData}>Get Weather</button>
      </div>

      <div className="temperature-button" onClick={handleTemperatureChange}>
        {temperatureUnit === 'celsius' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
      </div>

      {renderWeatherData()}

      <div className="favorites-container">
        <h3>Favorite Cities</h3>
        <ul>
          {favorites.map(favCity => <li key={favCity}>{favCity}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default WeatherApp;
