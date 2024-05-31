import AsyncStorage from "@react-native-async-storage/async-storage"
import { AsymmetricAgent, SymmetricAgent } from "../utils/crypto"

export function computeScore(encryptedScore: string, encryptedAccessToken: string) {
  return new Promise(async (resolve, reject) => {
    // 1. decrypt encryptedAccessToken with user private key
    const privateKey = await AsyncStorage.getItem('private');
    const publicKey = await AsyncStorage.getItem('public');

    console.log("privateKey", privateKey);
 
    let accessToken = "";

    try {
      const asymAgent = new AsymmetricAgent(publicKey as string, privateKey as string);
      accessToken = await asymAgent.decrypt(encryptedAccessToken);
    } catch (error) {
      resolve(0)
    }
  
    // 2. Use decrypted accessToken to decrypt encryptedScorec
    console.log("access token",accessToken)
    const symAgent = new SymmetricAgent(accessToken);
    console.log(encryptedScore)
    const encryptedData = encryptedScore.split(":")[0];
    const iv = encryptedScore.split(":")[1];
    console.log(encryptedData, iv)
    const score = await symAgent.decrypt(encryptedData, iv);
  
    // 3. Return score
    resolve(score);
  })

}