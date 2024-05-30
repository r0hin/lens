import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ReactNativeBiometrics from 'react-native-biometrics';
import Icon from 'react-native-vector-icons/Feather';
import { SETTINGS } from '../utils/settings';

export function AuthenticateScreen() {
  const navigation = useNavigation();
  const rnBiometrics = new ReactNativeBiometrics()

  const authenticateAuto = async () => {
    let result;
    if (SETTINGS.enableFaceID) result = await rnBiometrics.simplePrompt({ promptMessage: 'Authenticate with Face ID' });
    else result = { success: true }
    
    if (result?.success) {
      navigation.navigate("Main" as never);
    }
    else {
      Alert.alert("Error", "Biometric authentication failed.")
    }
  }

  return (
    <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", backgroundColor: "#000" }}> 
      <SafeAreaView style={{ padding: 12, display: 'flex', justifyContent: "space-between", alignItems: "flex-start", flexDirection: "column", flex: 1 }}>
        <View>
          <Text style={{ color: "white", fontSize: 42, fontWeight: 800, fontFamily: "SF Mono Heavy", letterSpacing: -3 }}>Authenticate</Text>
          <Text style={{ color: "#a3a3a3", fontSize: 16, fontWeight: 400, paddingTop: 4 }}>Your wallet is associated with a key pair.</Text>
        </View>
        <View style={{ padding: 12, borderRadius: 8, marginTop: 48, flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <Icon name='key' color={"#a3a3a3"} size={96} />
        </View>
        <KeyboardAvoidingView behavior="position" style={{width: "100%"}}>
          <View style={{ padding: 12, borderRadius: 8, marginTop: 48, flexDirection: "column", justifyContent: "center", alignItems: "flex-start", width: "100%" }}>
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