import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export function TestScreen() {
  const [userAddress, setUserAddress] = useState("")
  const [userReportNote, setUserReportNote] = useState("")
  const [userReportAddress, setUserReportAddress] = useState("")
  const [score, setScore] = useState(0)

  const queryUserScore = async () => {
    // using userAddress
    setScore(1)
  }

  const sendReport = async () => {
    // using userReportAddress, userReportNote
    console.log("sendReport")
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
      


    </View>
  );
}