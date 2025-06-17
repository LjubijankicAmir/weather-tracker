import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { countryCodeToName } from '../utils/countryMap';
import { ResizeMode, Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { searchCities, fetch5DayForecast, ForecastDay, SearchResult } from '../services/weatherService';
import WeatherCard from '../components/WeatherCard';
import DailyForecastCard from '../components/DailyForecastCard';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    addFavoriteCity,
    removeFavoriteCity,
    isCityFavorite,
  } from '../utils/favorites';
  import { ToastAndroid, Platform, Alert } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Weather'>;

export default function WeatherScreen({ route, navigation }: Props) {
  const { city, lat, lon } = route.params;

  const [cityData, setCityData] = useState<SearchResult | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    isCityFavorite(city).then(setIsFavorite);
  }, [city]);


  useEffect(() => {
    async function load() {
      try {
        setCityData({ name: city, country: '', lat, lon }); 
  
        const data = await fetch5DayForecast(lat, lon); 
        setForecast(data);
      } catch (err) {
        console.error(err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }
  
    load();
  }, [city, lat, lon]);
  

  function showToast(message: string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('', message);
    }
  }
  
  if (loading) {
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

        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  if (hasError || !forecast || !cityData) {
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
  
        <Ionicons
          name="arrow-back"
          size={28}
          color="white"
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        />
  
        <Text style={styles.loadingText}>No data found for this place.</Text>
      </View>
    );
  }

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

      <Ionicons
        name="arrow-back"
        size={28}
        color="white"
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      />

        <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={28}
            color="white"
            style={styles.favoriteIcon}
            onPress={async () => {
                if (!isFavorite) {
                await addFavoriteCity(city);
                showToast('City saved');
                setIsFavorite(true);
                } else {
                await removeFavoriteCity(city);
                showToast('City removed');
                setIsFavorite(false);
                }
            }}
        />


      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.country}>
            {countryCodeToName[cityData.country] || cityData.country}
          </Text>
        </View>

        <WeatherCard
        temperature={Math.round(forecast[0].temp)}
        iconCode={forecast[0].icon}
        />

        <View style={styles.extraInfo}>
        <Text style={styles.descriptionText}>
            {forecast[0].description.charAt(0).toUpperCase() + forecast[0].description.slice(1)}
        </Text>

        <Text style={styles.feelsLikeText}>
            Feels like: {Math.round(forecast[0].feels_like)}°C
        </Text>

        <View style={styles.infoRow}>
            <View style={styles.infoItem}>
                <MaterialIcons name="water-drop" size={24} color="#fff" />
                <Text style={styles.infoText}>{forecast[0].humidity}%</Text>
            </View>

            <View style={styles.infoItem}>
                <MaterialIcons name="air" size={24} color="#fff" />
                <Text style={styles.infoText}>{forecast[0].wind_speed} m/s</Text>
            </View>

            <View style={styles.infoItem}>
                <MaterialIcons name="visibility" size={24} color="#fff" />
                <Text style={styles.infoText}>{forecast[0].visibility / 1000} km</Text>
            </View>
        </View>
        </View>


        <View style={styles.forecastSection}>
        <Text style={styles.forecastTitle}>5-Day Forecast</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {forecast.map((day, index) => {
            const dayName = new Date(day.date).toLocaleDateString('en-US', {
                weekday: 'long',
            });

            return (
                <DailyForecastCard
                key={index}
                day={dayName}
                iconCode={day.icon}
                min={day.temp} 
                max={day.temp}
                />
            );
            })}
        </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  favoriteIcon: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
},         
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 100,
    paddingBottom: 40,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  city: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  country: {
    fontSize: 18,
    color: '#f5f5f5',
    marginTop: 4,
  },
  extraInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#f7f7f7',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  feelsLikeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    width: '80%',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    marginTop: 4,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },  
  forecastSection: {
    marginTop: 24,
    width: '100%',
    paddingLeft: 20,
  },
  forecastTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 400,
  },
  backIcon: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
});
