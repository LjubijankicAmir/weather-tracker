import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type Props = {
  day: string;
  iconCode: string;
  min: number;
  max: number;
};

export default function DailyForecastCard({ day, iconCode, min, max }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.day}>{day}</Text>
      <Image
        source={{ uri: `https://openweathermap.org/img/wn/${iconCode}@2x.png` }}
        style={styles.icon}
      />
      <Text style={styles.temp}>{Math.round(min)}° / {Math.round(max)}°</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginRight: 10,
    width: 120,
  },
  day: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#fff',
  },
  icon: {
    width: 50,
    height: 50,
  },
  temp: {
    marginTop: 6,
    color: '#fff',
  },
});
