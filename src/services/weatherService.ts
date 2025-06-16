const API_KEY = 'dd468384706d53008a83612bb985605a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export type WeatherResponse = {
  name: string;
  sys: { country: string };
  main: { temp: number };
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
