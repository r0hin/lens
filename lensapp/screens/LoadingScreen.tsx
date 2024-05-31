import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { useAccount } from 'wagmi'
import AsyncStorage from '@react-native-async-storage/async-storage';

export function LoadingScreen() {
  const navigation = useNavigation();
  const [userOnboarded, setUserOnboarded] = useState(2)
  const { status, address } = useAccount()

  useEffect(() => {

    let unsubscribe = () => {};
    if (status == "connected") {
      unsubscribe = firestore().collection("users").doc(address).onSnapshot(async (doc) => {
        if (doc.exists) {
          await AsyncStorage.setItem('public', doc.data()?.publicKey)

          if (address == "0xfF01A49f2B81C67a50770a97F6f0d8E172a7e357") {
            setUserOnboarded(3); // 3 = vendor
          }
          else { // 1=user
            setUserOnboarded(1);
          }

        }
        else {
          setUserOnboarded(0);
        }
      })
    }
    else if (status == "disconnected") {
      AsyncStorage.removeItem('public');
      AsyncStorage.removeItem('private');
    }

    return () => unsubscribe();
  }, [status])

  useEffect(() => {
    if (status == "connected") {
      console.log(userOnboarded)
      if (userOnboarded == 1) {
        // Todo: authenticate if we dont have the keys in storage or if it doesnt match.
        navigation.navigate("Authenticate" as never);          

        // navigation.navigate("Main" as never);
      }
      else if (userOnboarded == 0) {
        navigation.navigate("Onboard" as never);
      }
      else if (userOnboarded == 3) {
        navigation.navigate("Vendor" as never);
      }
      else {} // Do nothing, still determining if user is onboarded.
    }
    else if (status == "disconnected") {
      navigation.navigate("Login" as never);
    }
  }, [status, userOnboarded])

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
      <Text style={{color: "white"}}>Loading</Text>
    </View>
  );
}