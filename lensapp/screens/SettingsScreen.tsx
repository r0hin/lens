import React, { useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, Alert } from 'react-native';
import { ScrollView, Switch, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { W3mAccountButton, useWeb3Modal } from '@web3modal/wagmi-react-native';

export function SettingsScreen() {
  const [score, setScore] = useState(0)
  const [report, setReport] = useState("")
  const [modalVisible, setModalVisible] = useState(false);
  const [vendorModalVisible, setVendorModalVisible] = useState(false);
  const [addVendorInput, setAddVendorInput] = useState("")
  const rnBiometrics = new ReactNativeBiometrics()

  const { open, close } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const account = useAccount();

  const queryScore = () => {
    // using account.address
    setScore(score + 1)
  }

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

  const queryReport = () => {
    // using account.address
    setReport("a")
  }

  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-start", backgroundColor: "#000" }}>
      <ScrollView style={{ width: "100%" }}>
        <SafeAreaView style={{ padding: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop: 24, width: "100%" }}>
            {/* Gradient text */}
            <Text style={{ color: "white", fontSize: 64, textAlign: "center", fontWeight: 800, fontFamily: "SF Mono Heavy", letterSpacing: -1 }}>{account.address?.substring(0, 5)}...</Text>
          </View>

          <TouchableOpacity style={{
            borderColor: "#121315",
            borderWidth: 3,
            borderStyle: "dotted",
            padding: 12,
            borderRadius: 12,
            marginTop: 24,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
          }} onPress={() => {open()}}>
            <Icon name="user" size={16} color="white" />
            <Text style={{ color: "white", fontSize: 14, fontWeight: 500, marginLeft: 8 }}>Switch Accounts</Text>
          </TouchableOpacity>

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