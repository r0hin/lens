import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import ReactNativeBiometrics from 'react-native-biometrics';

const faceIDEnabled = false;

export function AuthenticateScreen() {
  const [privateKeyInput, setPrivateKeyInput] = React.useState("");
  const [showFaceID, setShowFaceID] = React.useState(true);
  const navigation = useNavigation();
  const rnBiometrics = new ReactNativeBiometrics()

  useEffect(() => {
    AsyncStorage.getItem('private').then((value) => {
      if ([null, undefined, "", "null", "undefined"].includes(value)) {
        setShowFaceID(false);
      }
    })
  }, [])

  const authenticateAuto = async () => {
    // Authenticate with Face ID.
    let result;
    if (faceIDEnabled) result = await rnBiometrics.simplePrompt({ promptMessage: 'Authenticate with Face ID' });
    else result = { success: true }
    
    if (result?.success) {
      const privateKey = await AsyncStorage.getItem('private');
      // verify match
  
      navigation.navigate("Main" as never);
    }
    else {
      Alert.alert("Error", "Biometric authentication failed.")
    }
  }

  const authenticate = async () => {
    const publickey = await AsyncStorage.getItem('public');
    privateKeyInput;

    // Verify the private key matches the public key.
    let approved = true;

    if (approved) {
      // Navigate to main.
      await AsyncStorage.setItem('private', privateKeyInput);
      console.log("Approved")
      navigation.navigate("Main" as never);
    }

  }

  return (
    <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", backgroundColor: "#000" }}> 
      <SafeAreaView style={{ padding: 12, display: 'flex', justifyContent: "space-between", alignItems: "flex-start", flexDirection: "column", flex: 1 }}>
        <View>
          <Text style={{ color: "white", fontSize: 42, fontWeight: 800, fontFamily: "SF Mono Heavy", letterSpacing: -3 }}>Authenticate</Text>
          <Text style={{ color: "#a3a3a3", fontSize: 16, fontWeight: 400, paddingTop: 4 }}>Your wallet is associated with a key pair.</Text>
        </View>
        <KeyboardAvoidingView behavior="position" style={{width: "100%"}}>
          <View style={{ padding: 12, borderRadius: 8, marginTop: 48, flexDirection: "column", justifyContent: "center", alignItems: "flex-start", width: "100%" }}>
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
            <TouchableOpacity style={{
              borderColor: "#121315",
              borderWidth: 3,
              borderStyle: "dotted",
              padding: 12,
              borderRadius: 8,
              marginTop: 12,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%"
            }} onPress={authenticate}>
              <Text style={{ color: "white", fontSize: 14, fontWeight: 500, marginLeft: 8 }}>Continue with Private Key</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 32, marginBottom: 32 }}>
              <Text style={{ color: "gray", fontSize: 12, fontWeight: 500, textAlign: 'center', width: "100%"}}>- or -</Text>
            </View> 

            {
              showFaceID && (
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity style={{
                      backgroundColor: "#5371FF",
                      padding: 12,
                      borderRadius: 8,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }} onPress={authenticateAuto}>
                      <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>Authenticate with Face ID</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }

            <View style={{ flexDirection: "row", marginTop: 16}}>
              <Text style={{ color: "#a3a3a3", fontSize: 14, fontWeight: 500 }}>If you lost your private key, you can </Text>
              <TouchableOpacity>
                <Text style={{ color: "#5371FF", fontSize: 14, fontWeight: 500 }}>reset your credit.</Text>
              </TouchableOpacity>
            </View> 
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}