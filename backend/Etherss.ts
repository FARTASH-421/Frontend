import { ethers, ContractTransactionResponse } from "ethers";
import dotenv from "dotenv";
import { CONTRACT_ABI } from "./../lib/contract-abi";

dotenv.config();

const INFURA_API: string | undefined = process.env.INFURA_API;
const PRIVATE_KEY: string | undefined = process.env.PRIVATE_KEY;

if (!INFURA_API || !PRIVATE_KEY) {
  throw new Error("❌ Please define INFURA_API and PRIVATE_KEY in .env");
}

console.log(INFURA_API, PRIVATE_KEY);

const provider = new ethers.JsonRpcProvider(INFURA_API);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contractAddress: string = "0x557720d98737A452E48D94EdB0428d61EbB85611";

console.log(CONTRACT_ABI);

// نوع دهی قرارداد با تابع requestPriceUpdate
// const contract = new ethers.Contract(
//   contractAddress,
//   CONTRACT_ABI,
//   wallet
// ) as ethers.BaseContract & {
//   requestPriceUpdate: (symbol: string) => Promise<ContractTransactionResponse>;
// };

// async function updatePrice(): Promise<void> {
//   try {
//     const tx: ContractTransactionResponse = await contract.requestPriceUpdate(
//       "AAPL"
//     );
//     console.log("✅ Price update tx sent:", tx.hash);
//     await tx.wait();
//     console.log("✅ Transaction confirmed.");
//   } catch (error: any) {
//     console.error("❌ Error while updating price:", error.message);
//   }
// }

// updatePrice();
