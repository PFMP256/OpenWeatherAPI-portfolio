import "./styles.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [weather, setWeather] = useState();
  const [toggleTemp, setToggleTemp] = useState(true);
  const [tempCurrent, setTempCurrent] = useState();
  const [tempMin, setTempMin] = useState();
  const [tempMax, setTempMax] = useState();
  const geolocation = navigator.geolocation;

  const getPosition = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=71060b69e0387934e117bd25f83fb4b7`
      )
      .then((res) => setWeather(res.data))
      .finally(() => {});
  };

  const options = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0
  };

  const error = (error) => console.log(error);
  useEffect(() => {
    geolocation.getCurrentPosition(getPosition, error, options);
  }, []);

  useEffect(() => {
    if (weather) {
      const KelvinCurrent = weather?.main.temp;
      const KelvinMin = weather?.main.temp_min;
      const KelvinMax = weather?.main.temp_max;
      const FarenheitCurrent = (KelvinCurrent - 273.15) * 1.8 + 32;
      const FarenheitMin = (KelvinMin - 273.15) * 1.8 + 32;
      const FarenheitMax = (KelvinMax - 273.15) * 1.8 + 32;
      const CelsiusCurrent = KelvinCurrent - 273.15;
      const CelsiusMin = KelvinMin - 273.15;
      const CelsiusMax = KelvinMax - 273.15;
      if (toggleTemp) {
        setTempCurrent(Math.round(CelsiusCurrent));
        setTempMin(Math.round(CelsiusMin));
        setTempMax(Math.round(CelsiusMax));
      } else {
        setTempCurrent(Math.round(FarenheitCurrent));
        setTempMin(Math.round(FarenheitMin));
        setTempMax(Math.round(FarenheitMax));
      }
    }
  }, [weather, toggleTemp]);

  return (
    weather && (
      <div className="App">
        {console.log(weather)}
        <div className="container text-light">
          <div className="Card">
            <h1 className="text-white py-3">{weather.name}</h1>
            <h2 className="py-2">{weather.sys.country}</h2>
            <div className="py-1">
              <img
                width="200px"
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
            </div>
            {/* Get Celsius */}
            <h1 className="py-2">
              {toggleTemp ? `${tempCurrent}°C` : `${tempCurrent}°F`}
            </h1>
            {/* show max and min temp */}
            <h3>
              <span className="px-4">
                {toggleTemp ? `${tempMin}°C` : `${tempMin}°F`}
              </span>
              <span className="px-4">
                {toggleTemp ? `${tempMax}°C` : `${tempMax}°F`}
              </span>
            </h3>
            {/* Weather description */}
            <h4 className="py-3">{weather.weather[0].description}</h4>
            <button
              onClick={() => setToggleTemp(!toggleTemp)}
              className="btn btn-warning py-1"
            >
              {toggleTemp ? "Convert to Farenheit" : "Convert to Celcius"}
            </button>
          </div>
        </div>
      </div>
    )
  );
}
