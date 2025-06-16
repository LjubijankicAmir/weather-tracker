import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import CityCard from '../components/CityCard';
import { countryCodeToName } from '../utils/countryMap';
import { useEffect } from 'react';
import { fetchCurrentWeather, WeatherResponse } from '../services/weatherService';

const CITIES = ['Sarajevo', 'Mostar', 'Zenica', 'Cazin'];


export default function HomeScreen() {

    const [weatherData, setWeatherData] = useState<WeatherResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadWeather() {
          try {
            const results: WeatherResponse[] = [];
      
            for (const city of CITIES) {
              const data = await fetchCurrentWeather(city);
              results.push(data);
            }
      
            setWeatherData(results);
          } catch (error) {
            console.error('Weather fetch failed:', error);
          } finally {
            setLoading(false);
          }
        }
      
        loadWeather();
      }, []);

  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/clear_weather.mp4')}
        rate={1.0}
        isMuted
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFill}
      />

      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.contentContainer}>

        <Text style={styles.title}>Weather Tracker</Text>

        <TextInput
          placeholder="Search for a city..."
          placeholderTextColor="#ccc"
          style={styles.searchInput}/>

        <Text style={styles.sectionTitle}>Your Cities</Text>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved cities</Text>
        </View>

        <Text style={styles.sectionTitle}>Popular Cities</Text>
        <View style={{ marginTop: 10 }}>
        {loading ? (
        <Text style={styles.loading}>Loading weather...</Text>
        ) : (
        weatherData.map((weather) => (
                <CityCard
                key={weather.name}
                city={weather.name}
                country={countryCodeToName[weather.sys.country] || weather.sys.country}
                temperature={Math.round(weather.main.temp)}
                iconUrl={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                />
            ))
        )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 80,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 20,
    },
    searchInput: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: '#fff',
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#fff',
      marginBottom: 10,
    },
    loading: {
        color: '#ccc',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
      },      
    emptyContainer: {
      alignItems: 'center',
      marginTop: 50,
      marginBottom: 100,
    },
    emptyText: {
      fontSize: 16,
      color: '#ccc',
      fontStyle: 'italic',
    },
  });
  
