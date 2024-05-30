import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'


export function HomeScreen() {
  const [score, setScore] = useState(0)
  const [report, setReport] = useState("")
  const [addVendorInput, setAddVendorInput] = useState("")

  const { disconnect } = useDisconnect();
  const account = useAccount();

  const queryScore = () => {
    // using account.address
    setScore(score + 1)
  }

  const addVendor = () => {
    // using addVendorInput
    console.log("add vendor")
  }

  const queryReport = () => {
    // using account.address
    setReport("a")
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000  " }}>
      <Text style={{color: "black", padding: 32}}>User things</Text>
      <TouchableOpacity onPress={() => {
        disconnect()
      }}>
        <Text>Disconnect wallet button</Text>
      </TouchableOpacity>
      <Text style={{padding: 12}}>addy: {account.address}</Text>
      <Text style={{padding: 12}}>SCORE ({score})</Text>
      <TouchableOpacity onPress={() => {
        queryScore()
      }
      }>
        <Text>Query score button</Text>
      </TouchableOpacity>

      <TextInput value={addVendorInput} onChangeText={setAddVendorInput} placeholder="(here)">add vendor input: </TextInput>
      <TouchableOpacity style={{padding: 12}} onPress={() => {
        addVendor()
      }
      }>
        <Text style={{padding: 12}}>add vendor button</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        queryReport()
      }
      }>
        <Text>Query report button</Text>
      </TouchableOpacity>

      <Text>report: {report}</Text>

    </View>
  );
}