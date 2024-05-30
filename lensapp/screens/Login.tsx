import { W3mButton } from '@web3modal/wagmi-react-native';
import React from 'react';
import { View, Text, Image } from 'react-native';

export function LoginScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}> 
      <Image source={require("../assets/logo.png")} style={{width: 120, height: 120}} />
      <Text style={{color: "white", paddingBottom: 148, fontSize: 16}}>A better way to prove trust.</Text>
      <W3mButton label="Connect to Lens" />
    </View>
  );
}