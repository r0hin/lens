import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function LoadingScreen() {
  const navigation = useNavigation();
  const { address } = useAccount()

  useEffect(() => {
    if (address) {
      navigation.navigate("Main" as never);
    }
    else {
      navigation.navigate("Login" as never);
    }
  })

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
      <Text>Loading</Text>
      {/* <TouchableOpacity onPress={onFinishLoading}>
        <Text>Finish loading</Text>
      </TouchableOpacity> */}
    </View>
  );
}