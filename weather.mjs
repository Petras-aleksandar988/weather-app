// https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,apparent_temperature,precipitation_probability,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=Europe%2FBerlin

export function getWeather(lat, long, timezone) {
  return fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,apparent_temperature,precipitation_probability,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=${timezone}`
  )
    .then((res) => res.json())
      .then((data) => {
        console.log(data);
      return {
        current: parseCurrentWeather(data),

           daily : parseDailyWeather(data),
           hourly : parseHourlyWeather(data)
      };
    });
}
function parseCurrentWeather({ current_weather, daily }) {
  const {
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: weatherCode,
  } = current_weather;
  const {
    apparent_temperature_max: [flmaxTemp],
    apparent_temperature_min: [flminTemp],
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    precipitation_sum: [precip],
  } = daily;
  return {
    currentTemp : Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    highFeelsLike: Math.round(flmaxTemp),
    lowfeelsLike: Math.round(flminTemp),
    windSpeed: Math.round(windSpeed),
    weatherCode,
    precip: Math.round(precip *100) /100,
  };
}
function parseDailyWeather({ daily }) {
    return daily.time.map((time,index)=> {
        return {
          timestamp: time * 1000,
          iconCode: daily.weathercode[index],
          maxTemp: Math.round(daily.temperature_2m_max[index])
        };
    })
}

function parseHourlyWeather({ current_weather, hourly }) {
  console.log(hourly);
     return  hourly.time.map((time, index) => {
        return {
          timestamp: time * 1000,
          iconCode: hourly.weathercode[index],
          temp: Math.round(hourly.temperature_2m[index]),
          feelsLike: Math.round(hourly.apparent_temperature[index]),
          windSpeed: Math.round(hourly.windspeed_10m[index]),
          percip: hourly.precipitation_probability[index],
        };
    }).filter(({timestamp})=> timestamp >= current_weather.time * 1000)
    
}