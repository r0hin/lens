import QuickCrypto from 'react-native-quick-crypto';
import Aes from 'react-native-aes-crypto';
import forge from 'node-forge';

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

const validateAndGetKeys = async (priv: string): Promise<Object> => {
  return new Promise((resolve, reject) => {
    try {
      var privateKey: any = forge.pki.privateKeyFromPem(priv);
      var publicKey: any = forge.pki.setRsaPublicKey(
        privateKey.n,
        privateKey.e,
      );
      privateKey = forge.pki.privateKeyToPem(privateKey);
      publicKey = forge.pki.publicKeyToPem(publicKey);
      console.log('Public Key', publicKey);
      resolve({publicKey, privateKey});
    } catch (err) {
      console.log(err);
      reject("Couldn't validate the private key");
    }
  });
};

export {
  generateKeyPair,
  generateSymmetricKey,
  SymmetricAgent,
  AsymmetricAgent,
  validateAndGetKeys,
};
