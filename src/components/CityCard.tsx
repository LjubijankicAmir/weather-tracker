import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';


type Props = {
  city: string;
  country: string;
  temperature: number;
};

export default function CityCard({ city, country, temperature }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.country}>{country}</Text>
      </View>

      <View style={styles.weatherContainer}>
        <Text style={styles.temp}>{temperature}°C</Text>
        <MaterialIcons name="wb-sunny" size={24} color="orange" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'column',
  },
  city: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  country: {
    fontSize: 14,
    color: '#444',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temp: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
