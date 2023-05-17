const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

// Generate a random private key using secp256k1 elliptic curve cryptography library
const privateKey = secp256k1.utils.randomPrivateKey();

// Get the corresponding public key for the generated private key using secp256k1 elliptic curve cryptography library
const publicKey = secp256k1.getPublicKey(privateKey);

// Hash the public key using the Keccak-256 hashing algorithm and slice off the last 20 bytes to obtain the Ethereum address
const ethAddress = keccak256(publicKey.slice(1)).slice(-20);

// Print out the generated private key, public key, and Ethereum address in hexadecimal format
console.log("Private key:", toHex(privateKey));
console.log("Public key:", toHex(publicKey));
console.log("Eth Address:", "0x" + toHex(ethAddress));
