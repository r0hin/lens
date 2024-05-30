import React, {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAccount, useDisconnect, useBalance, useWalletClient} from 'wagmi';
import {testEncryptDecrypt} from '../lib/crypto';

export function HomeScreen() {
  const [score, setScore] = useState(0);
  const [report, setReport] = useState('');
  const [addVendorInput, setAddVendorInput] = useState('');

  const {disconnect} = useDisconnect();
  const account = useAccount();
  const balance = useBalance({
    address: account.address,
  });

  const client = useWalletClient();

  const queryScore = () => {
    // using account.address
    setScore(score + 1);
  };

  const addVendor = () => {
    // using addVendorInput
    console.log('add vendor');
  };

  const queryReport = () => {
    // using account.address
    setReport('a');
  };

  //console.log('account', account);
  //console.log('balance', balance);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000  ',
      }}>
      <Text style={{color: 'black', padding: 32}}>User things</Text>
      <TouchableOpacity
        onPress={() => {
          disconnect();
        }}>
        <Text>Disconnect wallet button</Text>
      </TouchableOpacity>
      <Text style={{padding: 12}}>addy: {account.address}</Text>
      <Text style={{padding: 12}}>SCORE ({score})</Text>
      <TouchableOpacity
        onPress={() => {
          queryScore();
        }}>
        <Text>Query score button</Text>
      </TouchableOpacity>
      <Text>add vendor input: </Text>
      <TextInput
        value={addVendorInput}
        onChangeText={e => setAddVendorInput(e)}
        placeholder="(here)"></TextInput>
      <TouchableOpacity
        style={{padding: 12}}
        onPress={() => {
          addVendor();
        }}>
        <Text style={{padding: 12}}>add vendor button</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          queryReport();
        }}>
        <Text>Query report button</Text>
      </TouchableOpacity>
      <Text>report: {report}</Text>
      <TouchableOpacity
        //onPress={() => {
        //client.data.request({
        //method: 'eth_decrypt',
        //params: ['0x1c2b7e']

        //});
        //}}>
        onPress={() => {
          testEncryptDecrypt(
            'A1c08e8343db594b8522D622838D4a57a21E4864',
            '747a2fa5a6cfd842b74b97d6033d578c567e5305fd75d60ee757fdd81dd100a6',
          );
        }}>
        <Text>Test button</Text>
      </TouchableOpacity>
    </View>
  );
}

