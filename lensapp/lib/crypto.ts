import QuickCrypto from 'react-native-quick-crypto';
import {Buffer} from '@craftzdog/react-native-buffer';

const convertHexToPEM = (hexKey: any, keyType: any) => {
  // Convert the hexadecimal key to a Buffer
  const keyBuffer = Buffer.from(hexKey, 'hex');

  let derBuffer;
  if (keyType === 'public') {
    // ASN.1 structure header for a public key
    derBuffer = Buffer.concat([
      Buffer.from('3056301006072a8648ce3d020106052b8104000a034200', 'hex'),
      keyBuffer,
    ]);
  } else if (keyType === 'private') {
    // ASN.1 structure header for a private key
    derBuffer = Buffer.concat([
      Buffer.from('302e020100300506032b657004220420', 'hex'),
      keyBuffer,
    ]);
  } else {
    throw new Error('Unsupported key type');
  }

  // Convert the buffer to a PEM format
  const pemKey = `-----BEGIN ${keyType.toUpperCase()} KEY-----\n${derBuffer
    .toString('base64')
    .match(/.{1,64}/g)
    .join('\n')}\n-----END ${keyType.toUpperCase()} KEY-----\n`;

  return pemKey;
};

const generatAccessKey = () => {
  const key = QuickCrypto.randomBytes(32);
  return key;
};

const publicKeyEncrypt = (data: string, publicKey: string) => {
  const bufferedData = Buffer.from(data, 'utf8');
  const encrypted = QuickCrypto.publicEncrypt(publicKey, bufferedData);
  return encrypted;
};

function testEncryptDecrypt(publicKey: any, privateKey: any) {
  const message = 'Hello Node.js world!';
  const plaintext = Buffer.from(message, 'utf8');
  for (const key of [publicKey, privateKey]) {
    const ciphertext = QuickCrypto.publicEncrypt(key, plaintext);
    const received = QuickCrypto.privateDecrypt(privateKey, ciphertext);
    console.log(received.toString('utf8'));
  }
}

const privateKeyDecrypt = (data: string, privateKey: string) => {};

const symmetricEncrypt = (data: string, key: string) => {
  const byteArray = new TextEncoder().encode(data);
  const encrypted = QuickCrypto.privateEncrypt(key, byteArray);
  return encrypted;
};

const symmetricDecrypt = (data: string, key: string) => {
  const decrypted = QuickCrypto.privateDecrypt(
    {
      key: key,
    },
    data,
  );
  return decrypted;
};

export {
  generatAccessKey,
  publicKeyEncrypt,
  privateKeyDecrypt,
  symmetricEncrypt,
  symmetricDecrypt,
  testEncryptDecrypt,
};
