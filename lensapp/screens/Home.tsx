import React, {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAccount, useDisconnect, useBalance, useWalletClient} from 'wagmi';
import {
  AsymmetricAgent,
  SymmetricAgent,
  generateKeyPair,
  generateSymmetricKey,
} from '../lib/crypto';

export function HomeScreen() {
  const [score, setScore] = useState(0);
  const [report, setReport] = useState('');
  const [addVendorInput, setAddVendorInput] = useState('');
  const [encryptionKeys, setEncryptionKeys] = useState({
    publicKey: '',
    privateKey: '',
  });

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
      <Text style={{padding: 12}}>balance: {balance?.data?.formatted}</Text>
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
        onPress={async () => {
          const keys = await generateKeyPair();
          setEncryptionKeys(keys);
        }}>
        <Text>Generate Keypair</Text>
      </TouchableOpacity>
      <Text>{encryptionKeys.publicKey ? 'Set!' : 'None'}</Text>
      <Text>{encryptionKeys.privateKey ? 'Set!' : 'None'}</Text>
      <TouchableOpacity
        onPress={async () => {
          const key = await generateSymmetricKey('hello', 'hello', 512, 256);
          console.log('Symmetric Key', key);
        }}>
        <Text>Generate AccessKey</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          const key = await generateSymmetricKey('hello', 'hello', 512, 256);
          const agent = new SymmetricAgent(key);
          const encrypted = await agent.encrypt('hello');
          console.log('Encrypted', encrypted);
          const decrypted = await agent.decrypt(encrypted.cipher, encrypted.iv);
          console.log('Decrypted', decrypted);
        }}>
        <Text>Symmetric Encrypt Decrypt Test</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          const {publicKey, privateKey} = encryptionKeys;
          const agent = new AsymmetricAgent(publicKey, privateKey);
          const encrypted = await agent.encrypt('hello');
          console.log('Encrypted', encrypted);
          const decrypted = await agent.decrypt(encrypted);
          console.log('Decrypted', decrypted);
        }}>
        <Text>Asymmetric Encrypt Decrypt Test</Text>
      </TouchableOpacity>
    </View>
  );
}
