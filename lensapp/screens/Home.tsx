import React, {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  useAccount,
  useDisconnect,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import {
  AsymmetricAgent,
  SymmetricAgent,
  generateKeyPair,
  generateSymmetricKey,
  validateAndGetKeys,
} from '../lib/crypto';
import Lens from '../lib/contract';

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

  const {
    data: dataAlg,
    isError: isErrorAlg,
    isLoading: isLoadingAlg,
  } = useContractRead({
    ...Lens,
    functionName: 'getAlgorithm',
  });

  const {config} = usePrepareContractWrite({
    ...Lens,
    functionName: 'removeVendor',
    args: ['0xfF01A49f2B81C67a50770a97F6f0d8E172a7e357'],
  });

  const {data, isLoading, isSuccess, write} = useContractWrite(config);

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
          console.log('Keys', keys);
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

      <TouchableOpacity
        onPress={async () => {
          const {privateKey} = encryptionKeys;
          const publicKey = await validateAndGetKeys(privateKey);
          console.log('Public Key', publicKey);
        }}>
        <Text>Validate and Get Public Key</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          const privateKey = '---BEGIN---RANDOM SHIT';
          // catch promise rejection
          const publicKey = await validateAndGetKeys(privateKey).catch(err => {
            console.log('bad priv key');
          });
        }}>
        <Text>Validate and Get Public Key, but it failes</Text>
      </TouchableOpacity>
      <Text>{dataAlg}</Text>
      <TouchableOpacity
        onPress={async () => {
          console.log('removing vendor');
          write?.();
          console.log('done calling');
        }}>
        <Text>Remove Vendor Call</Text>
      </TouchableOpacity>
      <Text>{isLoading ? 'Loading...' : 'Ready'}</Text>
    </View>
  );
}
