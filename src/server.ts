import express from "express";
import { ethers } from "ethers";
import WebSocket from "ws";
import { config } from "dotenv";
config();

const app = express();
const port = 3000;

// ----- Écoute des événements Ethereum -----
const ethProvider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const ethContractAddress = "0xfF716c2A1Db9B2E714782324A0E74e8Da62556e9";
const ethContractABI = [
  "event Deposited(address indexed from, string tezosRecipient, uint256 amount)",
  "event Withdrawn(address indexed to, uint256 amount)"
];

const ethContract = new ethers.Contract(ethContractAddress, ethContractABI, ethProvider);

ethContract.on("Deposited", (from: string, ethRecipient: string, amount: bigint, event: ethers.EventLog) => {
  console.log("Ethereum Deposited Event:");
  console.log({ from, ethRecipient, amount: amount.toString() });
});

ethContract.on("Withdrawn", (to: string, amount: ethers.BigNumberish, event: ethers.EventLog) => {
  console.log("Ethereum Withdrawn Event:");
  console.log({ to, amount: amount.toString() });
});

// ----- Écoute des événements Tezos via TzKT WebSocket -----
const tzktWsUrl = "wss://api.tzkt.io/v1/events";
const tzktWs = new WebSocket(tzktWsUrl);

tzktWs.on("open", () => {
  console.log("Connecté au WebSocket TzKT pour les événements Tezos.");

});

tzktWs.on("message", (data: WebSocket) => {
  try {
    const message = JSON.parse(data.toString());
    if (message.type && message.type === "event") {
      console.log("Tezos Event reçu :", message);
    }
  } catch (error) {
    console.error("Erreur lors du parsing du message Tezos :", error);
  }
});

tzktWs.on("error", (err) => {
  console.error("Erreur WebSocket TzKT :", err);
});

tzktWs.on("close", () => {
  console.log("Connexion WebSocket TzKT fermée.");
});

// ----- Route Express pour vérifier que le serveur est lancé -----
app.get("/", (req, res) => {
  res.send("Serveur d'écoute d'événements Ethereum et Tezos en fonctionnement.");
});

app.listen(port, () => {
  console.log(`Serveur lancé à l'adresse http://localhost:${port}`);
});
