import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, Alert, Image } from 'react-native';
import { ScrollView, Switch, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import Lens from '../utils/contract'
import firestore from '@react-native-firebase/firestore';
import {generateSymmetricKey, AsymmetricAgent, SymmetricAgent} from '../utils/crypto'
import { masterKey } from '../utils/settings';

import { computeScore } from '../utils/credit'

export function VendorScreen() {
  const [lookupInput, setLookupInput] = useState("")
  const [canAccess, setCanAccess] = useState(false)
  const [looked, setLooked] = useState(false)
  const [appendScoreInput, setAppendScoreInput] = useState("")
  const [recordInput, setRecordInput] = useState("")

  const {
    data: dataAlg,
    isError: isErrorAlg,
    isLoading: isLoadingAlg,
  } = useContractRead({
    ...Lens,
    functionName: 'getAlgorithm',
    args: []
  });

  const {
    data: dataScore,
    isError: isErrorScore,
    isLoading: isLoadingScore,
    refetch: refetchScore
  } = useContractRead({
    ...Lens,
    args: [],
    functionName: 'getCreditScore',
    enabled: false,
  });


  const {
    data: dataToken,
    isError: isErrorToken,
    isLoading: isLoadingToken,
    refetch: refetchToken
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
    refetch: refetchUserToken
  } = useContractRead({
    ...Lens,
    functionName: 'getUserAccessKey',
    args: [lookupInput],
    // args: [""],
    enabled: false,
  });

   const {data:dataCreditReport, isLoading:isLoadingCreditReport, isSuccess: isSuccessCreditReport, write: writeCreditReport} = useContractWrite({
    ...Lens,
    functionName: 'uploadCreditReport',
  });

  // useEffect(() => {
  //   console.log(dataAlg)
  // }
  // , [dataAlg])

  const lookupCredit = () => {
    // Access the user
    // setCanAccess(true)
    // setLooked(true)
    // @ts-ignore
    // setEnableFetch(true)

    refetchToken?.()
    refetchUserToken?.()

    if (dataToken == undefined) {
      setCanAccess(false);
      setLooked(true);
    }

    console.log(lookupInput)

    setCanAccess(true)

    console.log(typeof dataToken)
    console.log(dataToken)
    // @ts-ignore
  //   computeScore(dataScore, dataToken).then((res) => {
  //     console.log(res)
  //     if (res) {
  //       setCanAccess(true)
  //       setLooked(true)
  //     } else {
  //       setCanAccess(false)
  //       setLooked(true)
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //     setCanAccess(false)
  //     setLooked(true)
  // })
}

  const requestAccess = () => {
    
  }

  // with appendScoreInput
  const appendScore = async () => {
    // @ts-ignore
    let encryptedUserToken: any = dataUserToken // @ts-ignore
    let encryptedVendorToken: any = dataToken
    let symAgent2;
    let scoreDelta;
    
    try {
      scoreDelta = parseInt(appendScoreInput);
    } catch (err) { 
      Alert.alert("Error", "Your number is whack, yo!"); 
      return 
    }

    let newScore = scoreDelta;

    // 1. get the users public key from firebase using their address
    const document = await firestore().collection("users").doc(lookupInput).get();
    const publicKey = document.data()?.publicKey;
    const asymAgent = new AsymmetricAgent(publicKey, "")
    const symAgent = new SymmetricAgent(masterKey)

    // 2. if the user has no score, generate a new set of AES keys
    if (!dataToken && !dataScore) {
      const newKey = await generateSymmetricKey(publicKey, publicKey, 256, 32)
    // 2.1 encrypt the accessKey with user public key

      encryptedUserToken = await asymAgent.encrypt(newKey)
      
    // 2.2 encrypt the AES key with a masterToken 
      encryptedVendorToken = await symAgent.encrypt(appendScoreInput)
      encryptedVendorToken = `${encryptedVendorToken.cipher}:${encryptedVendorToken.iv}`
      symAgent2 = new SymmetricAgent(newKey)
    }
/******************BELOW IS UNTESTED ****************/
    else {
      //3. if the user already has a score, decrypte the vendorToken using the master key
      // @ts-ignore
      const [cypher, iv] = (dataToken)?.split(":")
      const decryptedVendorToken = await symAgent.decrypt(cypher, iv)
      //3.1 useVendorToken to decrypt the score
      symAgent2 = new SymmetricAgent(decryptedVendorToken)
      // @ts-ignore
      const [cypher2, iv2] = (dataScore)?.split(":")
      const decryptedScore = await symAgent2.decrypt(cypher2, iv2)
      //4. change the score accordingly
      newScore = parseInt(decryptedScore) + scoreDelta
    }
    //5. write the encrypted score, encrypted userToken and encrypted vendorToken to the chain.
    const encryptedRecord = await asymAgent.encrypt(recordInput)
    let encryptedNewScore:any = await symAgent2.encrypt(newScore.toString())
    encryptedNewScore = `${encryptedNewScore.cipher}:${encryptedNewScore.iv}`


    console.log("lookupInput", lookupInput, "\nencryptedRecord", encryptedRecord, "\nnewScore", encryptedNewScore, "\nencryptedUserToken", encryptedUserToken, "\nencryptedVendorToken", encryptedVendorToken)

    writeCreditReport?.({
      args: [lookupInput, encryptedRecord, encryptedNewScore, encryptedUserToken, encryptedVendorToken]
    });
  }

  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-start", backgroundColor: "#000" }}>
      <ScrollView style={{ width: "100%" }}>
        <SafeAreaView style={{ padding: 12 }}>
         <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", paddingTop: 24, width: "100%" }}>
            {/* Gradient text */}
            <Text style={{ color: "white", fontSize: 64, textAlign: "left", fontWeight: 800, fontFamily: "SF Mono Heavy", letterSpacing: -3 }}>Lookup</Text>
            {/* <Text style={{ color: "white", fontSize: 14, textAlign: "left", fontWeight: 800, fontFamily: "SF Mono Heavy", letterSpacing: 2 }}>{dataAlg}</Text> */}
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
                <TextInput keyboardType="number-pad" style={{
                  borderColor: "#121315",
                  borderWidth: 2,
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                  color: "white",
                  width: "100%"
                }} placeholder="+/-" placeholderTextColor="gray" value={appendScoreInput} onChangeText={(text) => setAppendScoreInput(text)} />
                <TextInput style={{
                  borderColor: "#121315",
                  borderWidth: 2,
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                  color: "white",
                  width: "100%"
                }} placeholder="Report" placeholderTextColor="gray" value={recordInput} onChangeText={(text) => setRecordInput(text)} />
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