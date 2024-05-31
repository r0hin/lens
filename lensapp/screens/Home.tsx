import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Modal, Pressable, Alert} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import ReactNativeBiometrics from 'react-native-biometrics';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi';
import Lens from '../utils/contract';
import {computeScore} from '../utils/credit';
import {Notifier, Easing} from 'react-native-notifier';

import {SETTINGS, VENDORS} from '../utils/settings';
import ReportEntry from '../components/ReportEntry';
import {AsymmetricAgent} from '../utils/crypto';
import {parseReport} from '../utils/report';
import {ToastComponent} from '../components/toast';

export function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [vendorModalVisible, setVendorModalVisible] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [approved, setApproved] = useState([]);
  const rnBiometrics = new ReactNativeBiometrics();

  const [addVendorInput, setAddVendorInput] = useState('');
  const [score, setScore] = useState('N/A');
  const account = useAccount();

  const [reports, setReports] = useState([]);
  const [vendors, setVendors] = useState([]);

  const {
    data: dataVendor,
    isLoading: isLoadingVendor,
    isSuccess: isSuccessVendor,
    write: writeVendor,
  } = useContractWrite({
    ...Lens,
    functionName: 'allowVendorAccess',
  });

  useEffect(() => {
    const listener = firestore()
      .collection('users')
      .doc(account.address)
      .onSnapshot(snapshot => {
        setIncomingRequests(snapshot.data()?.incomingRequests || []);
        setApproved(snapshot.data()?.approved || []);
        console.log(snapshot.data()?.approved);
      });

    return () => listener();
  }, []);

  const {
    data: dataScore,
    isError: isErrorScore,
    isLoading: isLoadingScore,
    refetch: refetchScore,
  } = useContractRead({
    ...Lens,
    functionName: 'getCreditScore',
    args: [account.address],
    enabled: false,
  });

  const {
    data: dataRecords,
    isError: isErrorRecords,
    isLoading: isLoadingRecords,
    refetch: refetchRecords,
  } = useContractRead({
    ...Lens,
    account: account.address,
    functionName: 'retrieveCreditReports',
    args: [],
    enabled: false,
  });

  const {
    data: dataVendors,
    isError: isErrorVendors,
    isLoading: isLoadingVendors,
    refetch: refetchVendors,
  } = useContractRead({
    ...Lens,
    account: account.address,
    functionName: 'getVendors',
    args: [],
    enabled: false,
  });

  const {
    data: dataToken,
    isError: isErrorToken,
    isLoading: isLoadingToken,
    isSuccess: isSuccessToken,
  } = useContractRead({
    ...Lens,
    functionName: 'getUserAccessKey',
    args: [account.address],
  });

  useEffect(() => {
    // @ts-ignore
    refetchRecords?.();
    if (dataRecords) {
      getReports();
    }
  }, [dataRecords]);

  useEffect(() => {
    // @ts-ignore
    refetchScore?.();
    getScore();
  }, [dataScore, dataToken]);

  const getScore = async () => {
    refetchScore?.(); // @ts-ignore
    const result = (await computeScore( // @ts-ignore
      dataScore,
      dataToken,
      account.address,
    )) as string;
    setScore(result);
  };

  const getReports = async () => {
    refetchRecords?.(); // @ts-ignore
    // split and remove last entry
    const privateKey = await AsyncStorage.getItem(`${account.address}_private`);
    const publicKey = await AsyncStorage.getItem(`${account.address}_public`);

    const agent = new AsymmetricAgent(
      publicKey as string,
      privateKey as string,
    );
    // @ts-ignore
    const reports = dataRecords.split('$').slice(0, -1);
    // use agent to decrypt all entries
    const decryptedReports = await Promise.all(
      reports.map(async (report: string) => {
        const decrypted = await agent.decrypt(report);
        const parsed = parseReport(decrypted);
        return parsed;
      }),
    );
    decryptedReports.reverse();
    setReports(decryptedReports);
    console.log(decryptedReports);
  };

  const addVendor = async () => {
    let result;

    const availableVendors = Object.keys(VENDORS);
    if (!availableVendors.includes(addVendorInput)) {
      Notifier.showNotification({
        description: 'No trusted creditor found!',
        Component: props =>
          ToastComponent(props?.title || '', props?.description || ''),
        duration: 4000,
        showAnimationDuration: 749,
        showEasing: Easing.ease,
        hideOnPress: true,
      });

      setVendorModalVisible(false);

      return;
    }

    if (SETTINGS.enableFaceID)
      result = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate with Face ID',
      });
    else result = {success: true};

    if (result.success) {
      // Add vendor, abi call
      writeVendor?.({
        args: [addVendorInput],
      });

      await firestore()
        .collection('users')
        .doc(account.address)
        .update({
          incomingRequests: firestore.FieldValue.arrayRemove(addVendorInput),
          approved: firestore.FieldValue.arrayUnion(addVendorInput),
        });

      Notifier.showNotification({
        description: 'Transaction sent!',
        Component: props =>
          ToastComponent(props?.title || '', props?.description || ''),
        duration: 4000,
        showAnimationDuration: 749,
        showEasing: Easing.ease,
        hideOnPress: true,
      });
      setVendorModalVisible(false);
    } else {
      Alert.alert('Error', 'Biometric authentication failed');
    }
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
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingTop: 24,
              width: '100%',
            }}>
            {/* Gradient text */}
            <Text
              style={{
                color: 'white',
                fontSize: 64,
                textAlign: 'center',
                fontWeight: 800,
                fontFamily: 'SF Mono Heavy',
                letterSpacing: -3,
              }}>
              {score}
            </Text>
            <Text
              style={{
                color: 'gray',
                fontSize: 24,
                textAlign: 'center',
                fontWeight: 400,
                fontFamily: 'SF Mono',
                paddingBottom: 8,
                marginLeft: 2,
                letterSpacing: -3,
              }}>
              {/* @ts-ignore */}
              {reports[0] && reports[0].scoreDelta > 0 ? '+' : '-'}
              {/* @ts-ignore */}
              {reports[0] && reports[0].scoreDelta}
            </Text>
          </View>

          <Modal
            animationType="slide"
            presentationStyle="formSheet"
            visible={vendorModalVisible}
            onRequestClose={() => {
              setVendorModalVisible(!vendorModalVisible);
            }}>
            <View
              style={{
                backgroundColor: '#121315',
                padding: 24,
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}>
              <View
                style={{
                  width: '100%',
                  position: 'absolute',
                  top: 12,
                  left: 24,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                }}>
                <Icon name="chevron-down" size={18} color="#a3a3a3" />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 32,
                }}>
                <Icon
                  name="lock"
                  size={24}
                  style={{
                    color: 'white',
                    fontSize: 24,
                    fontWeight: 800,
                    marginRight: 10,
                  }}></Icon>
                <Text style={{color: 'white', fontSize: 24, fontWeight: 800}}>
                  Share Credit
                </Text>
              </View>
              <Text
                style={{
                  color: '#a3a3a3',
                  fontSize: 16,
                  fontWeight: 400,
                  paddingTop: 12,
                }}>
                Your credit score will be shared with a trusted vendor securely
                via cryptographic exchanges.
              </Text>

              <View
                style={{
                  marginTop: 24,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <Icon name="check" size={16} color="lime" />
                <Text
                  style={{
                    color: '#a3a3a3',
                    fontSize: 16,
                    marginLeft: 12,
                    fontWeight: 500,
                  }}>
                  Read your aggregated credit score
                </Text>
              </View>
              <View
                style={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <Icon name="check" size={16} color="lime" />
                <Text
                  style={{
                    color: '#a3a3a3',
                    fontSize: 16,
                    marginLeft: 12,
                    fontWeight: 500,
                  }}>
                  Append affecting items to your report
                </Text>
              </View>
              <View
                style={{
                  marginTop: 8,
                  marginBottom: 24,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <Icon name="x" size={16} color="red" />
                <Text
                  style={{
                    color: '#a3a3a3',
                    fontSize: 16,
                    marginLeft: 12,
                    fontWeight: 500,
                  }}>
                  Read your full credit history
                </Text>
              </View>

              <TextInput
                style={{
                  borderColor: '#a3a3a3',
                  borderWidth: 1,
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                  color: 'white',
                  width: '100%',
                }}
                placeholder="0x"
                placeholderTextColor="#a3a3a3"
                value={addVendorInput}
                onChangeText={text => setAddVendorInput(text)}
              />

              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
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
                    onPress={() => addVendor()}>
                    <Text
                      style={{color: 'white', fontSize: 14, fontWeight: 500}}>
                      Share
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text
                style={{
                  color: '#a3a3a3',
                  fontSize: 12,
                  fontWeight: 400,
                  paddingTop: 12,
                }}>
                Note: this action is irreversible.
              </Text>
            </View>
          </Modal>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 24,
              width: '100%',
            }}>
            <TouchableOpacity
              style={{
                borderColor: '#121315',
                borderWidth: 3,
                borderStyle: 'dotted',
                padding: 12,
                borderRadius: 8,
                marginTop: 24,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
              onPress={() => setVendorModalVisible(true)}>
              <Icon name="plus" size={16} color="white" />
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 500,
                  marginLeft: 8,
                }}>
                Share with Creditor
              </Text>
            </TouchableOpacity>
          </View>

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
              Recent Reports
            </Text>
            <Text
              style={{
                color: '#a3a3a3',
                fontSize: 14,
                fontWeight: 400,
                paddingTop: 24,
              }}>
              View All <Icon name="chevron-right" size={16} color="#a3a3a3" />
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 12,
              width: '100%',
            }}>
            {reports.map((report, index) => {
              return (
                <ReportEntry
                  key={index} // @ts-ignore
                  vendor={report.vendorKey} // @ts-ignore
                  score={report.scoreDelta} // @ts-ignore
                  date={report.timeAgoStr}
                />
              );
            })}
          </View>

          <Text
            style={{
              color: '#a3a3a3',
              fontSize: 14,
              textTransform: 'uppercase',
              fontWeight: 400,
              paddingTop: 24,
            }}>
            {incomingRequests.length && approved.length
              ? 'Creditors & Requests'
              : incomingRequests.length
              ? 'Creditors'
              : approved.length
              ? 'Requests'
              : 'No creditors or requests'}
          </Text>

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 12,
              width: '100%',
            }}>
            {approved.map((vendor, index) => {
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: '#121315',
                    borderRadius: 8,
                    padding: 12,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        backgroundColor: '#5371FF',
                        borderRadius: 4,
                        width: 42,
                        height: 42,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 16,
                      }}>
                      <Icon
                        style={{}}
                        name={(VENDORS[vendor] as any).icon}
                        size={22}
                        color="white"
                      />
                    </View>
                    <View>
                      <Text
                        style={{color: 'white', fontSize: 16, fontWeight: 500}}>
                        {(VENDORS[vendor] as any).name}
                      </Text>
                      <Text
                        style={{color: '#a3a3a3', fontSize: 13, paddingTop: 4}}>
                        Access granted
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
            {incomingRequests.map((request, index) => {
              return (
                <View
                  key={index}
                  style={{
                    borderColor: '#121315',
                    borderWidth: 3,
                    borderStyle: 'dotted',
                    borderRadius: 8,
                    padding: 12,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 4,
                        width: 42,
                        height: 42,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 16,
                      }}>
                      <Icon
                        style={{}}
                        name={(VENDORS[request] as any).icon}
                        size={22}
                        color="black"
                      />
                    </View>
                    <View>
                      <Text
                        style={{color: 'white', fontSize: 16, fontWeight: 500}}>
                        {(VENDORS[request] as any).name}
                      </Text>
                      <Text
                        style={{color: '#a3a3a3', fontSize: 13, paddingTop: 4}}>
                        Requested access
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setVendorModalVisible(true);
                        setAddVendorInput(request);
                      }}
                      style={{
                        backgroundColor: '#121315',
                        padding: 12,
                        borderRadius: 6,
                      }}>
                      <Icon name="check" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
