const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const hash = require("./scripts/hash");

app.use(cors());
app.use(express.json());

const balances = {
  "0x0f6cc022a606523ec2a06fc06bc38ffce74ab7d1": 100,
  "0xdeda08a56dc44afee1b2e8e9191e337edb2d82ca": 50,
  "0x4523e349d9f855cf15adee8e349bafa16953a899": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

// This function handles a POST request to send cryptocurrency
app.post("/send", (req, res) => {
  // Extract the message and signature from the request body
  const { message, signature } = req.body;

  // Extract the amount and recipient from the message object
  const { amount, recipient } = message;

  // Compute the sender's public key and address from the message and signature
  const publicKey = hash.signatureToPublicKey(message, signature);
  const sender = hash.publicKeyToAddress(publicKey);

  // Set initial balances for the sender and recipient
  setInitialBalance(sender);
  setInitialBalance(recipient);

  // Check if the sender has enough funds
  if (balances[sender] < amount) {
    // If the sender doesn't have enough funds, send an error response
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    // Otherwise, transfer the funds and send a success response with the sender's new balance
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
