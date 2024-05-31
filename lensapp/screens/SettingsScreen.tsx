import React, { useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, Alert } from 'react-native';
import { ScrollView, Switch, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useBalance } from 'wagmi'
import Clipboard from '@react-native-clipboard/clipboard';
import { W3mAccountButton, useWeb3Modal } from '@web3modal/wagmi-react-native';
import { SETTINGS } from '../utils/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function SettingsScreen() {
  const [score, setScore] = useState(0)
  const [report, setReport] = useState("")
  const [modalVisible, setModalVisible] = useState(false);
  const [vendorModalVisible, setVendorModalVisible] = useState(false);
  const [addVendorInput, setAddVendorInput] = useState("")
  const rnBiometrics = new ReactNativeBiometrics()

  const account = useAccount();
  const balance = useBalance({
    address: account.address,
  });

  const { open, close } = useWeb3Modal();

  const addVendor = () => {
    rnBiometrics.simplePrompt({ promptMessage: "Confirm credit share" }).then((result) => {
      if (result.success) {
        Alert.alert("Success", "Credit score to be shared with vendor")
      }
      else {
        Alert.alert("Error", "Biometric authentication failed")
      }
    }).catch((err) => {
      Alert.alert("Error", "Biometric authentication failed")
    })
  }

  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-start", backgroundColor: "#000" }}>
      <ScrollView style={{ width: "100%" }}>
        <SafeAreaView style={{ padding: 12 }}>
          <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: 24, width: "100%" }}>
            {/* Gradient text */}
            <Text style={{ color: "white", fontSize: 64, textAlign: "center", fontWeight: 800, fontFamily: "SF Mono Heavy", letterSpacing: -3 }}>{account.address?.substring(0, 7)}–</Text>
            <Text style={{ color: "#a3a3a3", fontSize: 24, textAlign: "center", fontWeight: 400, fontFamily: "SF Mono Heavy", letterSpacing: -3 }}>{balance?.data?.formatted.slice(0, 7)} rBTC</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop: 24, width: "100%" }}>
            <TouchableOpacity style={{
              borderColor: "#121315",
              borderWidth: 3,
              borderStyle: "dotted",
              padding: 12,
              borderRadius: 12,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 8,
            }} onPress={() => {open()}}>
              <Icon name="user" size={16} color="white" />
              <Text style={{ color: "white", fontSize: 14, fontWeight: 500, marginLeft: 8 }}>Switch Accounts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              borderColor: "#121315",
              borderWidth: 3,
              borderStyle: "dotted",
              padding: 12,
              borderRadius: 12,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 8,
            }} onPress={() => {
              Clipboard.setString(account.address || "no address");
              
            }}>
              <Icon name="copy" size={16} color="white" />
              <Text style={{ color: "white", fontSize: 14, fontWeight: 500, marginLeft: 8 }}>Copy Address</Text>
            </TouchableOpacity>
          </View>


          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 24, width: "100%" }}>
            <Text style={{ color: "#a3a3a3", fontSize: 14, textTransform: "uppercase", fontWeight: 400, paddingTop: 24 }}>
              Settings
            </Text>
          </View>

          <View style={{ flexDirection: "column", alignItems: "center", paddingTop: 12, width: "100%" }}>
            <View style={{ backgroundColor: "#121315", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View>
                  <Text style={{ color: "white", fontSize: 14, fontWeight: 400 }}>Raw credit scores</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Switch />
              </View>
            </View>
            <TouchableOpacity onPress={async () => {
              const publicKey = await AsyncStorage.getItem('public')
              if (publicKey) {
                Alert.alert("🔑 Public Key", publicKey)
              }
              else {
                Alert.alert("Error", "No public key found.")
              }
            }}>
              <View style={{ backgroundColor: "#121315", borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: 12, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View>
                    <Text style={{ color: "white", fontSize: 14, fontWeight: 400 }}>View public key</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="unlock" size={16} color="white" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => {
              let result;
              if (SETTINGS.enableFaceID) result = await rnBiometrics.simplePrompt({ promptMessage: 'Authenticate with Face ID' });
              else result = { success: true }
              
              if (result?.success) {
                const privateKey = await AsyncStorage.getItem('private')
                if (privateKey) {
                  Alert.alert("🔑 Private Key", privateKey)
                }
                else {
                  Alert.alert("Error", "No private key found.")
                }
              }
              else {
                Alert.alert("Error", "Biometric authentication failed.")
              }
            }}>
              <View style={{ backgroundColor: "#121315", borderBottomLeftRadius: 8, borderBottomRightRadius: 8, padding: 12, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View>
                    <Text style={{ color: "white", fontSize: 14, fontWeight: 400 }}>View private key</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="lock" size={16} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 24, width: "100%" }}>
            <Text style={{ color: "#a3a3a3", fontSize: 14, textTransform: "uppercase", fontWeight: 400, paddingTop: 24 }}>
              More
            </Text>
          </View>

          <View style={{ flexDirection: "column", alignItems: "center", paddingTop: 12, width: "100%" }}>
            <View style={{ backgroundColor: "#121315", borderRadius: 8, padding: 12, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View>
                  <Text style={{ color: "white", fontSize: 14, fontWeight: 400 }}>X (Twitter)</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Icon name="external-link" size={16} color="white" />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}