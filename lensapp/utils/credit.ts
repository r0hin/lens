import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsymmetricAgent, SymmetricAgent} from '../utils/crypto';

export function computeScore(
  encryptedScore: string,
  encryptedAccessToken: string,
  address: string,
) {
  return new Promise(async (resolve, reject) => {
    // 1. decrypt encryptedAccessToken with user private key
    const privateKey = await AsyncStorage.getItem(`${address}_private`);
    const publicKey = await AsyncStorage.getItem(`${address}_public`);

    let accessToken = '';

    const asymAgent = new AsymmetricAgent(
      publicKey as string,
      privateKey as string,
    );
    accessToken = await asymAgent.decrypt(encryptedAccessToken);

    // 2. Use decrypted accessToken to decrypt encryptedScorec
    const symAgent = new SymmetricAgent(accessToken);
    const encryptedData = encryptedScore.split(':')[0];
    const iv = encryptedScore.split(':')[1];
    //console.log(encryptedData, iv);
    const score = await symAgent.decrypt(encryptedData, iv);

    //console.log(score);

    // 3. Return score
    resolve(score);
  });
}

