import QuickCrypto from 'react-native-quick-crypto';
import Aes from 'react-native-aes-crypto';

// generate asymmetric key pair
const generateKeyPair = () => {
  return new Promise((resolve, reject) => {
    QuickCrypto.generateKeyPair(
      'rsa',
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: '',
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        }
        resolve({publicKey, privateKey});
      },
    );
  });
};

// generate symmetric encryption key
const generateSymmetricKey = (
  password: string,
  salt: string,
  cost: number,
  length: number,
) => {
  return Aes.pbkdf2(password, salt, cost, length, 'sha256');
};

class SymmetricAgent {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  encrypt(text: string) {
    return Aes.randomKey(16).then(iv => {
      return Aes.encrypt(text, this.key, iv, 'aes-256-cbc').then(cipher => ({
        cipher,
        iv,
      }));
    });
  }

  decrypt(cipher: string, iv: string) {
    return Aes.decrypt(cipher, this.key, iv, 'aes-256-cbc');
  }
}

// Assymetric agent
class AsymmetricAgent {
  publicKey: string | any;
  privateKey: string | any;

  constructor(publicKey: string, privateKey: string) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  encrypt(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const encrypted = QuickCrypto.publicEncrypt(
          this.publicKey,
          Buffer.from(data, 'utf8'),
        );
        resolve(encrypted.toString('base64'));
      } catch (err) {
        reject(err);
      }
    });
  }

  decrypt(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const decrypted = QuickCrypto.privateDecrypt(
          {
            key: this.privateKey,
            passphrase: '',
          },
          Buffer.from(data, 'base64'),
        );
        resolve(decrypted.toString('utf8'));
      } catch (err) {
        reject(err);
      }
    });
  }

  getKeys() {
    return {publicKey: this.publicKey, privateKey: this.privateKey};
  }
}

export {generateKeyPair, generateSymmetricKey, SymmetricAgent, AsymmetricAgent};
