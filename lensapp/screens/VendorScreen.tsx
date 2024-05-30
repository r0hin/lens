import React, { useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, Alert, Image } from 'react-native';
import { ScrollView, Switch, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

export function VendorScreen() {
  const [lookupInput, setLookupInput] = useState("")
  const [canAccess, setCanAccess] = useState(false)
  const [looked, setLooked] = useState(false)

  const lookupCredit = () => {
    // Access the user
    setCanAccess(true)
    setLooked(true)
  }

  const requestAccess = () => {

  }

  const appendScore = () => {

  }

  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-start", backgroundColor: "#000" }}>
      <ScrollView style={{ width: "100%" }}>
        <SafeAreaView style={{ padding: 12 }}>
         <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingTop: 24, width: "100%" }}>
            {/* Gradient text */}
            <Text style={{ color: "white", fontSize: 64, textAlign: "left", fontWeight: 800, fontFamily: "SF Mono Heavy", letterSpacing: -3 }}>Lookup</Text>
          </View>

          <TextInput value={lookupInput} style={{
            borderColor: "#121315",
            borderWidth: 3,
            borderStyle: "dotted",
            padding: 12,
            borderRadius: 8,
            marginTop: 12,
            color: "white",
            width: "100%"
          }} placeholder="0x" placeholderTextColor="gray" onChangeText={(text) => setLookupInput(text)} />

          <TouchableOpacity style={{
              borderColor: "#121315",
              borderWidth: 3,
              borderStyle: "dotted",
              padding: 12,
              borderRadius: 8,
              marginTop: 8,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%"
            }} onPress={lookupCredit}>
            <Icon name="book" size={16} color="white" />
            <Text style={{ color: "white", fontSize: 14, fontWeight: 500, marginLeft: 8 }}>Access Credit</Text>
          </TouchableOpacity>

          {/* Front and center box to show credit score */}
          {/* Horizontal line */}
          <View style={{ borderBottomColor: '#121315', borderBottomWidth: 1, marginTop: 24 }} />
          
          {(!canAccess && looked) && (
            <View>
              <View style={{ padding: 12, borderRadius: 8, marginTop: 24, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Icon name='shield' color={"#a3a3a3"} size={24} />
                <Text style={{ color: "#a3a3a3", fontSize: 16, fontWeight: 400, paddingLeft: 8 }}>No access to credit score</Text>
              </View>
              <TouchableOpacity style={{
                backgroundColor: "#5371FF",
                padding: 12,
                borderRadius: 8,
                marginTop: 24,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }} onPress={() => requestAccess()}>
                <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>Request</Text>
              </TouchableOpacity>
            </View>
          )}

          {
            (canAccess && looked) && (
              <View>
                <Text style={{ color: "white", fontSize: 64, textAlign: "center", fontWeight: 800, marginTop: 12, fontFamily: "SF Mono Heavy", letterSpacing: -3 }}>300</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 24, width: "100%" }}>
                  <Text style={{ color: "#a3a3a3", fontSize: 14, textTransform: "uppercase", fontWeight: 400, paddingTop: 24 }}>
                    Append
                  </Text>
                </View>
                <TextInput style={{
                  borderColor: "#121315",
                  borderWidth: 2,
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                  color: "white",
                  width: "100%"
                }} placeholder="+/-" placeholderTextColor="gray" />
                <TouchableOpacity style={{
                  backgroundColor: "#5371FF",
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }} onPress={() => appendScore()}>
                  <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>Send Transaction</Text>
                </TouchableOpacity>

              </View>
            )
          }
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}