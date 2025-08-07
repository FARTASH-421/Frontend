import { ethers } from "ethers";
import dotenv from "dotenv";
import { CONTRACT_ABI } from "../lib/contract-abi.js"; // ← با پسوند .js

dotenv.config();

const INFURA_API = process.env.INFURA_API;
const PRIVATE_KEY = process.env.PRIVATE_KEY;



if (!INFURA_API || !PRIVATE_KEY) {
  throw new Error("❌ Please define INFURA_API and PRIVATE_KEY in .env");
}

const provider = new ethers.JsonRpcProvider(INFURA_API);
// console.log(provider);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
console.log("wallet: ",  signer);

const LINK_TOKEN = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

const CONTRACT_ADDRESS = "0x557720d98737A452E48D94EdB0428d61EbB85611";
const LINK_ABI = [
    "function transfer(address to, uint256 amount) public returns (bool)"
  ];

// const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

const link = new ethers.Contract(LINK_TOKEN, LINK_ABI, signer);

async function fundContract() {
  const tx = await link.transfer(CONTRACT_ADDRESS, ethers.parseUnits("1.0", 18));
  await tx.wait();
  console.log("Contract funded with 1 LINK");
}

fundContract();


// console.log("contreact: ", contract);

// async function updatePrice() {
//   try {
//     const tx = await contract.requestPriceUpdate("AAPL");
//     console.log("✅ Price update tx sent:", tx.hash);
//     await tx.wait();
//     console.log("✅ Transaction confirmed.");
//   } catch (error) {
//     console.error("❌ Error while updating price:", error.message);
//   }
// }

// updatePrice();



// import { ethers } from "ethers";





