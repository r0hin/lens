import React, { useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, Alert, Image } from 'react-native';
import { ScrollView, Switch, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { W3mAccountButton, useWeb3Modal } from '@web3modal/wagmi-react-native';

export function CardsScreen() {
  const [score, setScore] = useState(0)
  const [report, setReport] = useState("")
  const [modalVisible, setModalVisible] = useState(false);
  const [vendorModalVisible, setVendorModalVisible] = useState(false);
  const [addVendorInput, setAddVendorInput] = useState("")
  const rnBiometrics = new ReactNativeBiometrics()

  const { open, close } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const account = useAccount();

  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-start", backgroundColor: "#000" }}>
      <ScrollView style={{ width: "100%" }}>
        <SafeAreaView style={{ padding: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop: 24, width: "100%" }}>
            {/* Gradient text */}
            <Text style={{ color: "white", fontSize: 64, textAlign: "center", fontWeight: 800, fontFamily: "SF Mono Heavy", letterSpacing: -1 }}>Cards</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 24, width: "100%" }}>
            <Text style={{ color: "#a3a3a3", fontSize: 14, textTransform: "uppercase", fontWeight: 400, paddingTop: 24 }}>
              Recommended Offers
            </Text>
          </View>

          <ScrollView horizontal={true}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 12, width: "100%" }}>
              <View style={{ borderColor: "#121315", borderWidth: 3, borderRadius: 8, padding: 12, width: 232, marginBottom: 8, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", marginRight: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View>
                    <Image source={{uri: "https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_reserve_card.png"}} style={{ width: 208, height: 128, borderRadius: 6 }} />
                    <Text style={{ marginTop: 18, color: "white", fontSize: 16, fontWeight: 500 }}>Chase Sapphire Reserve</Text>
                    <Text style={{ color: "#a3a3a3", fontSize: 14, fontWeight: 400 }}>Annual fee: $550</Text>
                  </View>
                </View>
              </View>
              <View style={{ borderColor: "#121315", borderWidth: 3, borderRadius: 8, padding: 12, width: 232, marginBottom: 8, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", marginRight: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View>
                    <Image source={{uri: "https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_reserve_card.png"}} style={{ width: 208, height: 128, borderRadius: 6 }} />
                    <Text style={{ marginTop: 18, color: "white", fontSize: 16, fontWeight: 500 }}>Chase Sapphire Reserve</Text>
                    <Text style={{ color: "#a3a3a3", fontSize: 14, fontWeight: 400 }}>Annual fee: $550</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}