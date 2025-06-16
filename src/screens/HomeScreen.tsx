import React from 'react';
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

export default function HomeScreen() {
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
            <CityCard
                city="Zagreb"
                country="Croatia"
                temperature={26}
            />

            <CityCard
                city="Sarajevo"
                country="Bosnia and Herzegovina"
                temperature={22}
            />
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
  
