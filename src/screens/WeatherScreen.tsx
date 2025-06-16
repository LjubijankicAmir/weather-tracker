import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Weather'>;

export default function WeatherScreen({ route, navigation }: Props) {
  const { city } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Weather for: {city}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
