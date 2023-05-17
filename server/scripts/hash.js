const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils");

// This function takes a message as input parameter
const hashMessage = (message) => {
  // Convert the message to a Uint8Array
  const messageArray = Uint8Array.from(message);
  // Hash the message using the keccak256 algorithm
  const hashedMessage = keccak256(messageArray);
  // Return the hashed message
  return hashedMessage;
};

// This function takes in a message and a signature, and returns the public key that corresponds to the signature.
const signatureToPublicKey = (message, signature) => {
  // First, we hash the message using the hashMessage function
  const hash = hashMessage(message);
  // Then, we convert the signature from hexadecimal to bytes
  const fullSignatureBytes = hexToBytes(signature);
  // The first byte of the signature corresponds to the recovery bit, so we extract it from the full signature bytes
  const recoveryBit = fullSignatureBytes[0];
  // The rest of the bytes correspond to the signature itself, so we extract them
  const signatureBytes = fullSignatureBytes.slice(1);
  // Finally, we use the secp library to recover the public key from the hash and signature bytes, as well as the recovery bit
  return secp.recoverPublicKey(hash, signatureBytes, recoveryBit);
};

// This function takes in a public key as input
// It then hashes the public key using the Keccak-256 hashing algorithm
// The first byte of the public key is sliced off to remove the prefix
// The last 20 bytes of the hashed public key are then sliced off to obtain the Ethereum address
// The Ethereum address is then converted to hexadecimal format and returned as a string
const publicKeyToAddress = (publicKey) => {
  const hash = keccak256(publicKey.slice(1)); // Remove prefix and hash using Keccak-256 algorithm
  const address = "0x" + toHex(hash.slice(-20)); // Obtain last 20 bytes of hash, convert to hex, and add prefix to obtain Ethereum address
  return address;
};

module.exports = {
  hashMessage,
  publicKeyToAddress,
  signatureToPublicKey,
};
