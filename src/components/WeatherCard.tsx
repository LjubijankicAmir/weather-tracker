import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type Props = {
  temperature: number;
  iconCode: string;
};

export default function WeatherCard({ temperature, iconCode }: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: `https://openweathermap.org/img/wn/${iconCode}@2x.png` }}
        style={styles.icon}
      />
      <Text style={styles.temp}>{temperature}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
  },
  temp: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
    color: '#fff',
  },
});
