import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'


export function HomeScreen() {

  const { disconnect } = useDisconnect();


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000  " }}>
      <Text style={{color: "white", padding: 32}}>Hi</Text>
      <TouchableOpacity onPress={() => {
        disconnect()
      }}>
        <Text>disoncnect</Text>
      </TouchableOpacity>
    </View>
  );
}