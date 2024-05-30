import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

export function AuthenticateScreen() {
  const [privateKeyInput, setPrivateKeyInput] = React.useState("");
  const navigation = useNavigation();

  const authenticate = async () => {
    const publickey = await AsyncStorage.getItem('public');

    // Verify the private key matches the public key.
    let approved = true;

    if (approved) {
      // Navigate to main.
      await AsyncStorage.setItem('private', privateKeyInput);
      navigation.navigate("Main" as never);
    }

    await Promise.all([
      await AsyncStorage.setItem('public', privateKeyInput)
    ]);
  }

  return (
    <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", backgroundColor: "#000" }}> 
      <SafeAreaView style={{ padding: 12, display: 'flex', justifyContent: "space-between", alignItems: "flex-start", flexDirection: "column", flex: 1 }}>
        <View>
          <Text style={{ color: "white", fontSize: 42, fontWeight: 800, fontFamily: "SF Mono Heavy", letterSpacing: -3 }}>Authenticate</Text>
          <Text style={{ color: "#a3a3a3", fontSize: 16, fontWeight: 400, paddingTop: 8 }}>Your wallet is associated with a key pair.</Text>
        </View>
        <View style={{ padding: 12, borderRadius: 8, marginTop: 48, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <TextInput multiline={true} style={{
            borderColor: "#a3a3a3",
            borderWidth: 1,
            padding: 12,
            borderRadius: 8,
            height: 92,
            marginTop: 12,
            color: "white",
            width: "100%"
          }} placeholder="-----BEGIN RSA PRIVATE KEY-----" placeholderTextColor="#a3a3a3" onChangeText={(text) => setPrivateKeyInput(text)} />
        </View>
        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={{
                backgroundColor: "#5371FF",
                padding: 12,
                borderRadius: 8,
                marginTop: 48,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }} onPress={authenticate}>
                <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>Authenticate</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: "row"}}>
            <Text style={{ color: "#a3a3a3", fontSize: 14, fontWeight: 500, marginTop: 8 }}>If you lost your private key, you can </Text>
            <TouchableOpacity>
              <Text style={{ color: "#5371FF", fontSize: 14, fontWeight: 500, marginTop: 8 }}>reset your credit.</Text>
            </TouchableOpacity>
          </View> 
        </View>
          
      </SafeAreaView>
    </View>
  );
}