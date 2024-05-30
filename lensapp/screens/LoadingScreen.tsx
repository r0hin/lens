import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

import { useAccount } from 'wagmi'

export function LoadingScreen() {
  const navigation = useNavigation();
  const { status } = useAccount()


  useEffect(() => {
    if (status == "connected") {
      navigation.navigate("Main" as never);
    }
    else if (status == "disconnected") {
      navigation.navigate("Login" as never);
    }
  }, [status])

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
      <Text style={{color: "white"}}>Loading</Text>
    </View>
  );
}