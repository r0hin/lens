import React from 'react';
import { View, Text } from 'react-native';

export function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2" }}>
      <Text style={{color: "black", padding: 32}}>Hi</Text>
    </View>
  );
}