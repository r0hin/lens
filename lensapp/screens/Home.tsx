import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, Alert } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import AsyncStorage from '@react-native-async-storage/async-storage';

export function HomeScreen() {
  const [score, setScore] = useState(0)
  const [report, setReport] = useState("")
  const [modalVisible, setModalVisible] = useState(false);
  const [vendorModalVisible, setVendorModalVisible] = useState(false);
  const [addVendorInput, setAddVendorInput] = useState("")
  const rnBiometrics = new ReactNativeBiometrics()

  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")

  const { disconnect } = useDisconnect();
  const account = useAccount();

  useEffect(() => {
    AsyncStorage.getItem('public').then((value) => {
      setPublicKey(value as string)
    })
    AsyncStorage.getItem('private').then((value) => {
      setPrivateKey(value as string)
    })
  }, [])

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
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-end", paddingTop: 24, width: "100%" }}>
            {/* Gradient text */}
            <Text style={{ color: "white", fontSize: 64, textAlign: "center", fontWeight: 800, fontFamily: "SF Mono Heavy", letterSpacing: -3 }}>300</Text>
            <Text style={{ color: "gray", fontSize: 32, textAlign: "center", fontWeight: 400, fontFamily: "SF Mono", paddingBottom: 8, marginLeft: 2, letterSpacing: -3 }}>+8</Text>
          </View>

          <Modal animationType="slide" presentationStyle="formSheet" visible={vendorModalVisible} onRequestClose={() => { setVendorModalVisible(!vendorModalVisible) }}>
            <View style={{ backgroundColor: "#121315", padding: 24, flex: 1, justifyContent: "flex-start", alignItems: "flex-start" }}>
              <View style={{ width: "100%", position: "absolute", top: 12, left: 24, flexDirection: "row", justifyContent: "center", alignItems: "center", display: "flex" }}>
                <Icon name="chevron-down" size={18} color="#a3a3a3" />
              </View>
              <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%", marginTop: 32 }}>
                <Icon name='lock' size={24} style={{ color: "white", fontSize: 24, fontWeight: 800, marginRight: 10 }}></Icon>
                <Text style={{ color: "white", fontSize: 24, fontWeight: 800 }}>Share Credit</Text>
              </View>
              <Text style={{ color: "#a3a3a3", fontSize: 16, fontWeight: 400, paddingTop: 12 }}>Your credit score will be shared with a trusted vendor securely via cryptographic exchanges.</Text>

              <View style={{ marginTop: 24, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                <Icon name="check" size={16} color="lime" />
                <Text style={{ color: "#a3a3a3", fontSize: 16, marginLeft: 12, fontWeight: 500 }}>Read your aggregated credit score</Text>
              </View>
              <View style={{ marginTop: 8, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                <Icon name="check" size={16} color="lime" />
                <Text style={{ color: "#a3a3a3", fontSize: 16, marginLeft: 12, fontWeight: 500 }}>Append affecting items to your report</Text>
              </View>
              <View style={{ marginTop: 8, marginBottom: 24, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                <Icon name="x" size={16} color="red" />
                <Text style={{ color: "#a3a3a3", fontSize: 16, marginLeft: 12, fontWeight: 500 }}>Read your full credit history</Text>
              </View>

              <TextInput style={{
                borderColor: "#a3a3a3",
                borderWidth: 1,
                padding: 12,
                borderRadius: 8,
                marginTop: 12,
                color: "white",
                width: "100%"
              }} placeholder="0x" placeholderTextColor="#a3a3a3" onChangeText={(text) => setAddVendorInput(text)} />

              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={{
                    backgroundColor: "#5371FF",
                    padding: 12,
                    borderRadius: 8,
                    marginTop: 24,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }} onPress={() => addVendor()}>
                    <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={{ color: "#a3a3a3", fontSize: 12, fontWeight: 400, paddingTop: 12 }}>Note: this action is irreversible.</Text>




            </View>
          </Modal>

          <Modal animationType="slide" presentationStyle="formSheet" visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }}>
            <View style={{ backgroundColor: "#121315", padding: 24, flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Icon name="chevron-down" size={18} color="#a3a3a3" style={{ position: "absolute", top: 12 }} />
              <Text>Details</Text>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Text>Close</Text>
              </Pressable>
            </View>
          </Modal>

          <TouchableOpacity style={{
            borderColor: "#121315",
            borderWidth: 3,
            borderStyle: "dotted",
            padding: 12,
            borderRadius: 8,
            marginTop: 24,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
          }} onPress={() => setVendorModalVisible(true)}>
            <Icon name="plus" size={16} color="white" />
            <Text style={{ color: "white", fontSize: 14, fontWeight: 500, marginLeft: 8 }}>Share with Creditor</Text>
          </TouchableOpacity>

          <Text style={{color: "white"}}>
            {publicKey}
          </Text>
          <Text style={{color: "white"}}>
            {privateKey}
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 24, width: "100%" }}>
            <Text style={{ color: "#a3a3a3", fontSize: 14, textTransform: "uppercase", fontWeight: 400, paddingTop: 24 }}>
              Recent Reports
            </Text>
            <Text style={{ color: "#a3a3a3", fontSize: 14, fontWeight: 400, paddingTop: 24 }}>
              View All <Icon name="chevron-right" size={16} color="#a3a3a3" />
            </Text>
          </View>

          <View style={{ flexDirection: "column", alignItems: "center", paddingTop: 12, width: "100%" }}>
            <View style={{ backgroundColor: "#121315", borderRadius: 8, padding: 12, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  backgroundColor: "#5371FF",
                  borderRadius: 4,
                  width: 42,
                  height: 42,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Icon style={{}} name="dollar-sign" size={22} color="white" />
                </View>
                <View>
                  <Text style={{ color: "white", fontSize: 16, fontWeight: 500 }}>Monthly Payment Succeeded</Text>
                  <Text style={{ color: "#a3a3a3", fontSize: 13, paddingTop: 4 }}>American Express, 2 hours ago</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#5371FF", fontSize: 16, marginRight: 8 }}>+8</Text>
                <Icon name="chevron-right" size={16} color="#a3a3a3" />
              </View>
            </View>
            <View style={{ backgroundColor: "#121315", borderRadius: 8, padding: 12, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  backgroundColor: "#5371FF",
                  borderRadius: 4,
                  width: 42,
                  height: 42,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Icon style={{}} name="credit-card" size={22} color="white" />
                </View>
                <View>
                  <Text style={{ color: "white", fontSize: 16, fontWeight: 500 }}>Monthly Payment Bounced</Text>
                  <Text style={{ color: "#a3a3a3", fontSize: 13, paddingTop: 4 }}>American Express, 3 hours ago</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "red", fontSize: 16, marginRight: 8 }}>-2</Text>
                <Icon name="chevron-right" size={16} color="#a3a3a3" />
              </View>
            </View>
          </View>

          <Text style={{ color: "#a3a3a3", fontSize: 14, textTransform: "uppercase", fontWeight: 400, paddingTop: 24 }}>
            Connected Creditors
          </Text>

          <View style={{ flexDirection: "column", alignItems: "center", paddingTop: 12, width: "100%" }}>
            <View style={{ backgroundColor: "#121315", borderRadius: 8, padding: 12, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  backgroundColor: "#000",
                  borderRadius: 4,
                  width: 42,
                  height: 42,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Icon style={{}} name="target" size={22} color="white" />
                </View>
                <View>
                  <Text style={{ color: "white", fontSize: 16, fontWeight: 500 }}>Target</Text>
                  <Text style={{ color: "#a3a3a3", fontSize: 13, paddingTop: 4 }}>Connected 9 weeks ago</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Icon name="chevron-right" size={16} color="#a3a3a3" />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}