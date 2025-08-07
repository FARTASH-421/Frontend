import { ethers } from "ethers";
import dotenv from "dotenv";
import { CONTRACT_ABI } from "../lib/contract-abi"; // Make sure this path is correct

dotenv.config();

// Ensure these environment variables exist
const INFURA_API = process.env.INFURA_API;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!INFURA_API || !PRIVATE_KEY) {
  throw new Error("❌ Please define INFURA_API and PRIVATE_KEY in .env");
}

console.log("INFURA_API:", INFURA_API);
console.log("PRIVATE_KEY:", PRIVATE_KEY);

// const provider = new ethers.JsonRpcProvider(INFURA_API);
// const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// const contractAddress = "0x557720d98737A452E48D94EdB0428d61EbB85611";
// const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet);

// async function updatePrice() {
//   try {
//     const tx = await contract.requestPriceUpdate("AAPL");
//     console.log("✅ Price update tx sent:", tx.hash);
//     await tx.wait();
//     console.log("✅ Transaction confirmed.");
//   } catch (error: any) {
//     console.error("❌ Error while updating price:", error.message);
//   }
// }

// Call the function if you want to run it immediately
// updatePrice();
