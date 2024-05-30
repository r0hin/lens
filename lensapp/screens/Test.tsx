import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';

export function TestScreen() {
  const [userAddress, setUserAddress] = useState('');
  const [userReportNote, setUserReportNote] = useState('');
  const [userReportAddress, setUserReportAddress] = useState('');
  const [score, setScore] = useState(0);

  const queryUserScore = async () => {
    // using userAddress
    setScore(1);
  };

  const sendReport = async () => {
    // using userReportAddress, userReportNote
    console.log('sendReport');
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>VENDOR AREA</Text>

      <Text>Get user score</Text>
      <Text>User address:</Text>
      <TextInput
        value={userAddress}
        onChangeText={e => setUserAddress(e)}
        placeholder="(here)"></TextInput>
      <Text>Score: {score}</Text>
      <TouchableOpacity
        onPress={() => {
          queryUserScore();
        }}>
        <Text>Query score button</Text>
      </TouchableOpacity>

      <Text style={{paddingTop: 32}}>send report</Text>

      <Text>user address:</Text>
      <TextInput
        value={userReportAddress}
        onChangeText={e => setUserReportAddress(e)}
        placeholder="(here)"></TextInput>
      <Text>note:</Text>
      <TextInput
        value={userReportNote}
        onChangeText={e => setUserReportNote(e)}
        placeholder="(here)"></TextInput>

      <TouchableOpacity
        onPress={() => {
          sendReport();
        }}>
        <Text>Send report button</Text>
      </TouchableOpacity>
    </View>
  );
}

