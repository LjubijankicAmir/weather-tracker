const API_KEY = 'dd468384706d53008a83612bb985605a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export type WeatherResponse = {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  weather: { main: string; description: string; icon: string }[];
};



export async function fetchCurrentWeather(city: string): Promise<WeatherResponse> {

  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data: WeatherResponse = await response.json();
  return data;
}

export type SearchResult = {
    name: string;
    country: string;
    lat: number;
    lon: number;
    state?: string;
  };
  
  export async function searchCities(query: string): Promise<SearchResult[]> {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
  
    if (!response.ok) {
      throw new Error('Failed to search cities');
    }
  
    return await response.json();
  }

  export type ForecastDay = {
    date: string;
    temp: number;
    icon: string;
  };
  
  
  export async function fetch5DayForecast(lat: number, lon: number): Promise<ForecastDay[]> {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
  
    if (!response.ok) {
      const text = await response.text();
      console.error('5-day forecast error:', text);
      throw new Error('Failed to fetch 5-day forecast');
    }
  
    const data = await response.json();
  
    const grouped: Record<string, any[]> = {};
  
    for (const entry of data.list) {
      const dateKey = entry.dt_txt.slice(0, 10);
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(entry);
    }
  
    const dailySummaries: ForecastDay[] = Object.keys(grouped)
      .slice(0, 5)
      .map((date) => {
        const dayEntries = grouped[date];
        const noonEntry = dayEntries.find((e) => e.dt_txt.includes('12:00:00')) || dayEntries[0];
  
        return {
          date,
          temp: noonEntry.main.temp,
          icon: noonEntry.weather[0].icon,
          description: noonEntry.weather[0].description,
          feels_like: noonEntry.main.feels_like,
          humidity: noonEntry.main.humidity,
          wind_speed: noonEntry.wind.speed,
          visibility: noonEntry.visibility,
        };
      });
  
    return dailySummaries;
  }

  export async function fetchCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherResponse> {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
  
    if (!response.ok) {
      throw new Error('Failed to fetch current weather');
    }
    
    const data = await response.json();
    return data as WeatherResponse;
  }
  
  
