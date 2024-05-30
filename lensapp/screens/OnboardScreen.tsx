import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { useAccount } from 'wagmi';

export function OnboardScreen() {
  const [vendorModalVisible, setVendorModalVisible] = React.useState(false);
  const [publicKeyInput, setPublicKeyInput] = React.useState("");
  const [privateKeyInput, setPrivateKeyInput] = React.useState("");
  const account = useAccount();

  const useOwnKeys = async () => {
    await AsyncStorage.setItem('public', privateKeyInput)
    await firestore().collection("users").doc(account.address).set({
      publicKey: publicKeyInput
    });
  }

  const setupAutomatically = async () => {
    // await Promise.all([
    //   await AsyncStorage.setItem('private', privateKeyInput),
    //   await AsyncStorage.setItem('public', privateKeyInput)
    // ]);

    // await firestore().collection("users").doc(account.address).set({
    //   publicKey: publicKeyInput
    // });
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
                }} placeholder="-----BEGIN RSA PUBLIC KEY-----" placeholderTextColor="#a3a3a3" onChangeText={(text) => setPublicKeyInput(text)} />

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
          <Icon name='key' color={"#a3a3a3"} size={96} />
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