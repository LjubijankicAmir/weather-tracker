import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';


type Props = {
  city: string;
  country: string;
  temperature: number;
  iconUrl: string;
  onPress?: () => void;
};

export default function CityCard({ city, country, temperature, iconUrl, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.country}>{country}</Text>
      </View>
      <View style={styles.weatherContainer}>
        <Text style={styles.temp}>{temperature}°C</Text>
        <Image source={{ uri: iconUrl }} style={styles.icon} />
      </View>
    </Pressable>
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
    color: '#ffffff',
  },
  country: {
    fontSize: 14,
    color: '#f5f5f5',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temp: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  icon: {
    width: 48,
    height: 48,
  },
});
