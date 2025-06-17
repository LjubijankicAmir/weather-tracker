import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITE_CITIES';

export async function getFavoriteCities(): Promise<string[]> {
  const data = await AsyncStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

export async function addFavoriteCity(city: string): Promise<void> {
  const existing = await getFavoriteCities();
  if (!existing.includes(city)) {
    const updated = [...existing, city];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }
}

export async function removeFavoriteCity(city: string): Promise<void> {
  const existing = await getFavoriteCities();
  const updated = existing.filter((c) => c !== city);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export async function isCityFavorite(city: string): Promise<boolean> {
  const existing = await getFavoriteCities();
  return existing.includes(city);
}
