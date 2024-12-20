import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, KeyboardAvoidingView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { useAccount } from 'wagmi';
import { generateKeyPair, validateAndGetKeys } from "../utils/crypto"

export function OnboardScreen() {
  const [vendorModalVisible, setVendorModalVisible] = React.useState(false);
  const [privateKeyInput, setPrivateKeyInput] = React.useState("");
  const account = useAccount();

  const useOwnKeys = async () => {
    let keys = {
      publicKey: "",
      privateKey: ""
    }
    try {
      keys = await validateAndGetKeys(privateKeyInput) as {
        publicKey: string,
        privateKey: string
      };
    } catch (error) {
      Alert.alert("Error", "Your private key is invalid. Please try again.");
    }
      
    await Promise.all([
      await AsyncStorage.setItem(`${account.address}_private`, keys?.privateKey),
      await AsyncStorage.setItem(`${account.address}_public`, keys?.publicKey)
    ]);


    await firestore().collection("users").doc(account.address).set({
      publicKey: keys?.publicKey
    });
  }

  const setupAutomatically = async () => {
    const keys = await generateKeyPair() as {
      publicKey: string,
      privateKey: string
    };

    await Promise.all([
      await AsyncStorage.setItem(`${account.address}_private`, keys?.privateKey),
      await AsyncStorage.setItem(`${account.address}_public`, keys?.publicKey)
    ]);

    await firestore().collection("users").doc(account.address).set({
      publicKey: keys?.publicKey
    });
  }

  return (
    <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", backgroundColor: "#000" }}> 
      <SafeAreaView style={{ padding: 12, display: 'flex', justifyContent: "space-between", flexDirection: "column", flex: 1 }}>
        <View>
          <Text style={{ color: "white", fontSize: 42, fontWeight: 800, fontFamily: "SF Mono Heavy", letterSpacing: -3 }}>Get Started</Text>
          <Text style={{ color: "#a3a3a3", fontSize: 16, fontWeight: 400, paddingTop: 8 }}>To use Lens, you need to associate a new key pair with your wallet. This is securely stored locally.</Text>

          <Modal animationType="slide" presentationStyle="formSheet" visible={vendorModalVisible} onRequestClose={() => { setVendorModalVisible(!vendorModalVisible) }}>
            <View style={{ backgroundColor: "#121315", flex: 1, justifyContent: "space-between", alignItems: "flex-start", padding: 24, width: "100%" }}>
              {/* <View style={{ width: "100%", position: "absolute", top: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", display: "flex" }}>
                <Icon name="chevron-down" size={18} color="#a3a3a3" />
              </View> */}
              <View>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%", marginTop: 32 }}>
                  <Icon name='lock' size={24} style={{ color: "white", fontSize: 24, fontWeight: 800, marginRight: 10 }}></Icon>
                  <Text style={{ color: "white", fontSize: 24, fontWeight: 800 }}>Custom Keys</Text>
                </View>
                <Text style={{ color: "#a3a3a3", fontSize: 16, fontWeight: 400, paddingTop: 12, paddingBottom: 24 }}>Your credit score can also be encrypted with your own provided key pair.</Text>
              </View>
              <KeyboardAvoidingView keyboardVerticalOffset={16} behavior='position' style={{width: "100%"}}>
                <TextInput multiline={true} style={{
                  borderColor: "#a3a3a3",
                  borderWidth: 1,
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                  height: 92,
                  color: "white",
                  width: "100%"
                }} placeholder="-----BEGIN RSA PRIVATE KEY-----" placeholderTextColor="#a3a3a3" onChangeText={(text) => setPrivateKeyInput(text)} />

                <TouchableOpacity style={{
                  backgroundColor: "#5371FF",
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 24,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }} onPress={() => useOwnKeys()}>
                  <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>Confirm</Text>
                </TouchableOpacity>
                <Text style={{ color: "#a3a3a3", fontSize: 12, fontWeight: 400, paddingVertical: 12 }}>Note: this action permanently associates these keys with your wallet. If you lose they keys, your credit will be unreadable.</Text>
              </KeyboardAvoidingView>
            </View>
          </Modal>
        </View>
        <View style={{ padding: 12, borderRadius: 8, marginTop: 48, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <Icon name='shield' color={"#a3a3a3"} size={96} />
        </View>
        <View>
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
              }} onPress={setupAutomatically}>
                <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>Generate</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#a3a3a3", fontSize: 14, fontWeight: 500, marginTop: 8 }}>Alternatively, you can </Text>
            <TouchableOpacity onPress={() => {
              setVendorModalVisible(true);
            }}>
              <Text style={{ color: "#5371FF", fontSize: 14, fontWeight: 500, marginTop: 8 }}>provide your own key pair!</Text>
            </TouchableOpacity>
          </View> 
        </View>

          
      </SafeAreaView>
    </View>
  );
}