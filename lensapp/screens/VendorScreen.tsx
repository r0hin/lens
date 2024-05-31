import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  Alert,
  Image,
  Switch as SwitchComponent,
} from 'react-native';
import {
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {useAccount, useContractRead, useContractWrite} from 'wagmi';
import Lens from '../utils/contract';
import firestore from '@react-native-firebase/firestore';
import {Notifier, Easing} from 'react-native-notifier';
import {
  generateSymmetricKey,
  AsymmetricAgent,
  SymmetricAgent,
} from '../utils/crypto';
import {masterKey} from '../utils/settings';
import {generateReport} from '../utils/report';

import {computeScore} from '../utils/credit';
import {decrypt} from 'react-native-aes-crypto';
import {ToastComponent} from '../components/toast';

export function VendorScreen() {
  const [lookupInput, setLookupInput] = useState('');
  const [canAccess, setCanAccess] = useState(false);
  const [looked, setLooked] = useState(false);
  const [appendScoreInput, setAppendScoreInput] = useState('');
  const [recordInput, setRecordInput] = useState('');
  const [userScore, setUserScore] = useState('0');
  const [usageRatio, setUsageRatio] = useState('');
  const [isPayed, setIsPayed] = useState(false);
  const account = useAccount();

  const {
    data: dataAlg,
    isError: isErrorAlg,
    isLoading: isLoadingAlg,
  } = useContractRead({
    ...Lens,
    functionName: 'getAlgorithm',
    args: [],
  });

  const {
    data: dataScore,
    isError: isErrorScore,
    isLoading: isLoadingScore,
    refetch: refetchScore,
  } = useContractRead({
    ...Lens,
    args: [lookupInput],
    functionName: 'getCreditScore',
    enabled: false,
  });

  const {
    data: dataToken,
    isError: isErrorToken,
    isLoading: isLoadingToken,
    refetch: refetchToken,
  } = useContractRead({
    ...Lens,
    functionName: 'getVendorAccessKey',
    args: [lookupInput],
    // args: [""],
    enabled: false,
  });

  const {
    data: dataUserToken,
    isError: isErrorUserToken,
    isLoading: isLoadingUserToken,
    refetch: refetchUserToken,
  } = useContractRead({
    ...Lens,
    functionName: 'getUserAccessKey',
    args: [lookupInput],
    // args: [""],
    enabled: false,
  });

  const {
    data: dataCreditReport,
    isLoading: isLoadingCreditReport,
    isSuccess: isSuccessCreditReport,
    write: writeCreditReport,
  } = useContractWrite({
    ...Lens,
    functionName: 'uploadCreditReport',
  });

  // useEffect(() => {
  //   console.log(dataAlg)
  // }
  // , [dataAlg])

  const lookupCredit = async () => {
    // Access the user
    // setCanAccess(true)
    // setLooked(true)
    // @ts-ignore
    // setEnableFetch(true)

    refetchToken?.();
    refetchUserToken?.();
    refetchScore?.();

    const targetDoc = await firestore()
      .collection('users')
      .doc(lookupInput)
      .get();
    const approved = targetDoc.data()?.approved || [];

    if (!approved.includes(account.address)) {
      setCanAccess(false);
      setLooked(true);
    } else {
      setCanAccess(true);
      setLooked(true);
    }
    if (!dataScore || !dataToken) {
      return;
    }
    // use masterkey to unlock decryption key
    const symAgent = new SymmetricAgent(masterKey);
    // @ts-ignore
    let [cypher, iv] = dataToken?.split(':');
    const decryptedKey = await symAgent.decrypt(cypher, iv);
    //console.log(decryptedKey);
    //return;
    const symAgent2 = new SymmetricAgent(decryptedKey);
    // @ts-ignore
    let [cypher2, iv2] = dataScore?.split(':');
    symAgent2.decrypt(cypher2, iv2).then(decryptedScore => {
      setUserScore(decryptedScore.toString());
    });
  };

  const requestAccess = async () => {
    const targetAddress = lookupInput;
    await firestore()
      .collection('users')
      .doc(targetAddress)
      .update({
        incomingRequests: firestore.FieldValue.arrayUnion(account.address),
      });
    Notifier.showNotification({
      description: 'Request sent!',
      Component: props =>
        ToastComponent(props?.title || '', props?.description || ''),
      duration: 4000,
      showAnimationDuration: 749,
      showEasing: Easing.ease,
      hideOnPress: true,
    });
  };

  // with appendScoreInput
  const appendScore = async () => {
    const message = generateReport(
      new Date(), // @ts-ignore
      account.address,
      appendScoreInput,
      isPayed,
      usageRatio,
      recordInput,
    );
    // const agent = new SymmetricAgent(masterKey)
    // const cypher = "/9KQYJJqjk1IQxC/8drD5A=="
    // const iv = "1e5ea667c40699ab5cc73781a02aa437"
    // const decrypted = await agent.decrypt(cypher, iv)
    // console.log(decrypted)

    // return
    // @ts-ignore
    let encryptedUserToken: any = dataUserToken; // @ts-ignore
    let encryptedVendorToken: any = dataToken;
    let symAgent2;
    let decryptedVendorToken;
    let scoreDelta;

    try {
      scoreDelta = parseInt(appendScoreInput);
    } catch (err) {
      Alert.alert('Error', 'Your number is whack, yo!');
      return;
    }

    let newScore = scoreDelta;

    // 1. get the users public key from firebase using their address
    const document = await firestore()
      .collection('users')
      .doc(lookupInput)
      .get();
    const publicKey = document.data()?.publicKey;

    // these two agents unlocks the key to unlock Symagent2
    const asymAgent = new AsymmetricAgent(publicKey, '');
    const symAgent = new SymmetricAgent(masterKey);

    // console.log(dataToken, dataScore)
    // return
    // 2. if the user has no score, generate a new set of AES keys
    if (!dataToken && !dataScore) {
      // if (!dataToken && !dataScore || true) {
      const newKey = await generateSymmetricKey(publicKey, publicKey, 256, 192);
      console.log('unencryped vendor token sub:', newKey);
      // 2.1 encrypt the accessKey with user public key

      encryptedUserToken = await asymAgent.encrypt(newKey);

      // 2.2 encrypt the AES key with a masterToken
      encryptedVendorToken = await symAgent.encrypt(newKey);
      encryptedVendorToken = `${encryptedVendorToken.cipher}:${encryptedVendorToken.iv}`;

      // SymAgent2 unlocks score
      symAgent2 = new SymmetricAgent(newKey);
    } else {
      /******************BELOW IS UNTESTED ****************/
      //3. if the user already has a score, decrypte the vendorToken using the master key
      // @ts-ignore
      const [cypher, iv] = dataToken?.split(':');
      decryptedVendorToken = await symAgent.decrypt(cypher, iv);
      console.log('BLACK', decryptedVendorToken);
      //3.1 useVendorToken to decrypt the score
      symAgent2 = new SymmetricAgent(decryptedVendorToken);
      // @ts-ignore
      const [cypher2, iv2] = dataScore?.split(':');
      const decryptedScore = await symAgent2.decrypt(cypher2, iv2);
      //4. change the score accordingly
      newScore = parseInt(decryptedScore) + scoreDelta;
    }
    //5. write the encrypted score, encrypted userToken and encrypted vendorToken to the chain.
    // console.log(`unencrypted record: ${recordInput}`, `unencrypted new score: ${newScore}`, `unencrypted userToken: should be same as unencrypted vendor`, `unencrypted vendorToken: ${decryptedVendorToken || ""}`)
    const encryptedRecord = await asymAgent.encrypt(message);
    let encryptedNewScore: any = await symAgent2.encrypt(newScore.toString());
    encryptedNewScore = `${encryptedNewScore.cipher}:${encryptedNewScore.iv}`;

    console.log(
      'lookupInput',
      lookupInput,
      '\nencryptedRecord',
      encryptedRecord,
      '\nnewScore',
      encryptedNewScore,
      '\nencryptedUserToken',
      encryptedUserToken,
      '\nencryptedVendorToken',
      encryptedVendorToken,
    );

    console.log('sent');
    writeCreditReport?.({
      args: [
        lookupInput,
        encryptedRecord,
        encryptedNewScore,
        encryptedUserToken,
        encryptedVendorToken,
      ],
    });
    Notifier.showNotification({
      description: 'Transaction sending!',
      Component: props =>
        ToastComponent(props?.title || '', props?.description || ''),
      duration: 4000,
      showAnimationDuration: 749,
      showEasing: Easing.ease,
      hideOnPress: true,
    });
    setLookupInput('');
    setCanAccess(false);
    setLooked(false);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#000',
      }}>
      <ScrollView style={{width: '100%'}}>
        <SafeAreaView style={{padding: 12}}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              paddingTop: 24,
              width: '100%',
            }}>
            {/* Gradient text */}
            <Text
              style={{
                color: 'white',
                fontSize: 64,
                textAlign: 'left',
                fontWeight: 800,
                fontFamily: 'SF Mono Heavy',
                letterSpacing: -3,
              }}>
              Lookup
            </Text>
            {/* <Text style={{ color: "white", fontSize: 14, textAlign: "left", fontWeight: 800, fontFamily: "SF Mono Heavy", letterSpacing: 2 }}>{dataAlg}</Text> */}
          </View>

          <TextInput
            value={lookupInput}
            style={{
              borderColor: '#121315',
              borderWidth: 3,
              borderStyle: 'dotted',
              padding: 12,
              borderRadius: 8,
              marginTop: 12,
              color: 'white',
              width: '100%',
            }}
            placeholder="0x"
            placeholderTextColor="gray"
            onChangeText={text => setLookupInput(text)}
          />

          <TouchableOpacity
            style={{
              borderColor: '#121315',
              borderWidth: 3,
              borderStyle: 'dotted',
              padding: 12,
              borderRadius: 8,
              marginTop: 8,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
            onPress={lookupCredit}>
            <Icon name="book" size={16} color="white" />
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                fontWeight: 500,
                marginLeft: 8,
              }}>
              Access Credit
            </Text>
          </TouchableOpacity>

          {/* Front and center box to show credit score */}
          {/* Horizontal line */}
          <View
            style={{
              borderBottomColor: '#121315',
              borderBottomWidth: 1,
              marginTop: 24,
            }}
          />

          {!canAccess && looked && (
            <View>
              <View
                style={{
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 24,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="shield" color={'#a3a3a3'} size={24} />
                <Text
                  style={{
                    color: '#a3a3a3',
                    fontSize: 16,
                    fontWeight: 400,
                    paddingLeft: 8,
                  }}>
                  No access to credit score
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#5371FF',
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 24,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => requestAccess()}>
                <Text style={{color: 'white', fontSize: 14, fontWeight: 500}}>
                  Request
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {canAccess && looked && (
            <View>
              <Text
                style={{
                  color: 'white',
                  fontSize: 64,
                  textAlign: 'center',
                  fontWeight: 800,
                  marginTop: 12,
                  fontFamily: 'SF Mono Heavy',
                  letterSpacing: -3,
                }}>
                {userScore}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 24,
                  width: '100%',
                }}>
                <Text
                  style={{
                    color: '#a3a3a3',
                    fontSize: 14,
                    textTransform: 'uppercase',
                    fontWeight: 400,
                    paddingTop: 24,
                  }}>
                  Add Report
                </Text>
              </View>
              <TextInput
                keyboardType="numbers-and-punctuation"
                style={{
                  borderColor: '#121315',
                  borderWidth: 2,
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                  color: 'white',
                  width: '100%',
                }}
                placeholder="+/- Score"
                placeholderTextColor="gray"
                value={appendScoreInput}
                onChangeText={text => setAppendScoreInput(text)}
              />
              <TextInput
                style={{
                  borderColor: '#121315',
                  borderWidth: 2,
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                  color: 'white',
                  width: '100%',
                }}
                placeholder="Remark (optional)"
                placeholderTextColor="gray"
                value={recordInput}
                onChangeText={text => {
                  if (text.length < 32) {
                    setRecordInput(text.toUpperCase());
                  }
                }}
              />
              <Text
                style={{
                  color: '#a3a3a3',
                  fontSize: 14,
                  textTransform: 'uppercase',
                  fontWeight: 400,
                  paddingTop: 24,
                }}>
                Payment In Full?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <TextInput
                  keyboardType="number-pad"
                  style={{
                    borderColor: '#121315',
                    borderWidth: 2,
                    padding: 12,
                    borderRadius: 8,
                    marginTop: 12,
                    color: 'white',
                    width: '80%',
                  }}
                  placeholder="Utilization Ratio"
                  placeholderTextColor="gray"
                  value={usageRatio}
                  onChangeText={text => setUsageRatio(text)}
                />
                <SwitchComponent
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={isPayed ? '#f4f4f4' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setIsPayed}
                  value={isPayed}
                />
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#5371FF',
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => appendScore()}>
                <Text style={{color: 'white', fontSize: 14, fontWeight: 500}}>
                  Send Transaction
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
