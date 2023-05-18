import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, toHex } from "ethereum-cryptography/utils";

// A map of test accounts with private and public keys
const TestAccounts = new Map([
  [
    "Test 1",
    {
      private:
        "f37a3b807ceadf05c52a1a83b36b98913e6b7c61d0da1f3b7d30c458ea782308",
      public:
        "0450acb1d24b74d83199e3c4f0d43896f2418fbd7b64340d85a24896a8b93ab07ac77caabeb19932f7727c409a0674a9415152aa9258967363ee21e1c368c306c0",
    },
  ],
  [
    "Test 2",
    {
      private:
        "52278765384b1b51460b31210a4151e35ed9d5b8141628e369661ae88a517e2a",
      public:
        "049ce157e8aa3ade5cf5c698608bc1fdb4818e289312b04a3476af0b5f7c0a54f6d9042ff7a31d5845a028e1b68b2c78dd0d12915a7a19b74889485fbf20af8c0f",
    },
  ],
  [
    "Test 3",
    {
      private:
        "1844507cbad56e23db7b9ff36080648e9977eb28ad42ffee6e3f544d91473856",
      public:
        "04d33a1b562712da2b148bc3cfa60041db3eafe7b00ae0ae7a81be508d5629726407c9a97d83942a843e2ee4f540cda26c09654a7ddba6dbb0b62e6c3871c98b3d",
    },
  ],
]);

// Usernames derived from the list of accounts
const Accounts = Array.from(TestAccounts.keys());

// This function takes a message as input, and returns its hash value
const hashMessage = (message) => {
  // First, we convert the message to a Uint8Array
  const messageUint8 = Uint8Array.from(message);

  // We then calculate the hash value of this Uint8Array using the keccak256 hashing algorithm
  const hashBuffer = keccak256(messageUint8);

  // Finally, we return the hashBuffer as the output of this function
  return hashBuffer;
};

// This function takes a user as input and returns the private key as a Uint8Array.
const getPrivateKey = (user) => {
  // We first attempt to retrieve the private key of the user from the TestAccounts object.
  // If the user is not found, TestAccounts.get(user) will return undefined.
  // If the user exists but does not have a private key, TestAccounts.get(user)?.private will return null.
  // If the user exists and has a private key, TestAccounts.get(user)?.private will return a hex string representation of the private key.
  const hexPrivateKey = TestAccounts.get(user)?.private ?? null;

  // We convert the hex string representation of the private key to a Uint8Array using the hexToBytes function.
  return hexToBytes(hexPrivateKey);
};

// This function takes a user as input and returns the public key associated with their account
const getPublicKey = (user) => {
  // Get the account object for the input user
  const account = TestAccounts.get(user);
  // If no account exists for the user, return null
  if (!account) return null;
  // Convert the hexadecimal public key string to a byte array and return it
  return hexToBytes(account.public);
};

// This function takes a user object as input and returns a string representing their Ethereum address
const getAddress = (user) => {
  // If there is no user object, return null
  if (!user) {
    return null;
  }

  // Get the user's public key
  const publicKey = getPublicKey(user);
  // Remove the first character (prefix) from the public key
  const publicKeyWithoutPrefix = publicKey.slice(1);
  // Hash the public key (using the keccak256 algorithm)
  const hash = keccak256(publicKeyWithoutPrefix);
  // Take the last 20 bytes of the hash (representing the Ethereum address)
  const address = hash.slice(-20);
  // Convert the address to a hexadecimal string
  const addressWithPrefix = "0x" + toHex(address);

  // Return the address with the "0x" prefix
  return addressWithPrefix;
};

// This function takes in a username and a message
// It is an asynchronous function, meaning it returns a promise that resolves to a value at some point in the future
const signMessage = async (username, message) => {
  // We get the user's private key using their username
  const privateKey = getUserPrivateKey(username);

  // We hash the message using a hashing function
  const messageHash = hashMessage(message);

  // We are using secp to sign the message with the private key
  // The sign function returns an array containing the signature and recovery bit
  // We are using object destructuring to assign the signature and recovery bit to separate variables
  const [signature, recoveryBit] = await secp.sign(messageHash, privateKey, {
    recovered: true,
  });

  // We are creating a new Uint8Array containing the recovery bit and the signature
  const fullSignature = new Uint8Array([recoveryBit, ...signature]);

  // We are returning the fullSignature as a hexadecimal string
  return toHex(fullSignature);
};

const Keeper = {
  Accounts,
  signMessage,
  getAddress,
};
export default Keeper;
