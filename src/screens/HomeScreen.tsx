import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import CityCard from '../components/CityCard';
import { countryCodeToName } from '../utils/countryMap';
import { useEffect } from 'react';
import { fetchCurrentWeather, WeatherResponse } from '../services/weatherService';
import { searchCities, SearchResult } from '../services/weatherService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';


const CITIES = ['Sarajevo', 'Mostar', 'Zenica', 'Cazin'];

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


export default function HomeScreen({ navigation }: Props) {

    const [weatherData, setWeatherData] = useState<WeatherResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

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

      useEffect(() => {
        const timeout = setTimeout(() => {
          if (query.length >= 3) {
            setSearchLoading(true);
            searchCities(query)
              .then(setSearchResults)
              .catch((err) => {
                console.error(err);
                setSearchResults([]);
              })
              .finally(() => setSearchLoading(false));
          } else {
            setSearchResults([]);
          }
        }, 500);
      
        return () => clearTimeout(timeout);
      }, [query]);

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
        style={{flex: 1}}>

        <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled">

        <Text style={styles.title}>Weather Tracker</Text>

        <TextInput
          placeholder="Search for a city..."
          placeholderTextColor="#ccc"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}/>

        {query.length >= 3 && (
        <View style={styles.searchDropdown}>
            {searchLoading ? (
            <Text style={styles.searchDropdownText}>Searching...</Text>
            ) : searchResults.length === 0 ? (
            <Text style={styles.searchDropdownText}>No matching cities</Text>
            ) : (
            searchResults.map((city, index) => (
                <Text
                key={`${city.name}-${index}`}
                style={styles.searchDropdownItem}
                onPress={() => {
                    setQuery('');
                    setSearchResults([]);
                    navigation.navigate('Weather', { city: city.name, lat: city.lat, lon: city.lon });
                }}
                >
                {city.name}, {city.state ? `${city.state}, ` : ''}{countryCodeToName[city.country] || city.country}
                </Text>
            ))
            )}
        </View>
        )}

        <Text style={styles.sectionTitle}>Your Cities</Text>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved cities</Text>
        </View>

        <Text style={styles.sectionTitle}>Popular Cities</Text>
        <View style={{ marginTop: 10, marginBottom: 30 }}>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
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
      marginBottom: 4,
    },
    searchDropdown: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 16,
      },
      searchDropdownText: {
        color: '#444',
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: 4,
      },
      searchDropdownItem: {
        color: '#000',
        fontSize: 16,
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
      },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#fff',
      marginTop: 20,
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
  
