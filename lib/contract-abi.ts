import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x592823B2270ACD6f61727B375A762aD0F6453FFD";
// export const CONTRACT_ADDRESS = "0xC460824D48726EfF16eAF7563452e0925EF7c9f6";

export const CONTRACT_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
    ],
    name: "ChainlinkCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
    ],
    name: "ChainlinkFulfilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
    ],
    name: "ChainlinkRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newLimit",
        type: "uint256",
      },
    ],
    name: "PriceFreshnessLimitUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "price",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "PriceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "StockAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalCost",
        type: "uint256",
      },
    ],
    name: "StockBought",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "StockRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalValue",
        type: "uint256",
      },
    ],
    name: "StockSold",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  { stateMutability: "payable", type: "fallback" },
  {
    inputs: [
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "string", name: "_name", type: "string" },
    ],
    name: "addStock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "buyStock",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "fee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_requestId", type: "bytes32" },
      { internalType: "string", name: "_price", type: "string" },
    ],
    name: "fulfill",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllStockTokens",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "address", name: "_user", type: "address" },
    ],
    name: "getBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLinkBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLinkTokenAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_symbol", type: "string" }],
    name: "getPirceStr",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStockCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_symbol", type: "string" }],
    name: "getStockPrice",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_symbol", type: "string" }],
    name: "getTokenAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
    ],
    name: "getTokenSymbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_symbol", type: "string" }],
    name: "isPriceFresh",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isStockToken",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "jobId",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "priceFreshnessLimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_symbol", type: "string" }],
    name: "removeStock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_symbol", type: "string" }],
    name: "requestPriceUpdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "requestToSymbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "sellStock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_seconds", type: "uint256" }],
    name: "setPriceFreshnessLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "string", name: "_price", type: "string" },
    ],
    name: "simulatePriceUpdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "", type: "string" }],
    name: "stockExists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "", type: "string" }],
    name: "stockPrice",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "stockTokens",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "", type: "string" }],
    name: "stocks",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      {
        internalType: "address payable",
        name: "tokenAddress",
        type: "address",
      },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "uint256", name: "lastUpdated", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "address", name: "_from", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "transform",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
] as const;

export type Stock = {
  id: number;
  name: string;
  symbol: string;
  tokenAddress: string;
  price: string;
  priceStr: string;
  lastUpdated?: string;
  balance?: string;
};

export type StockContract = ethers.Contract & {
  addStock: (
    _symbol: string,
    _name: string
  ) => Promise<ethers.ContractTransactionResponse>;
  buyStock: (
    _symbol: string,
    _amount: bigint,
    options?: { value: bigint }
  ) => Promise<ethers.ContractTransactionResponse>;
  fee: () => Promise<bigint>;
  fulfill: (
    _requestId: string,
    _price: string
  ) => Promise<ethers.ContractTransactionResponse>;
  getAllStockTokens: () => Promise<string[]>;
  getBalance: (_symbol: string, _user: string) => Promise<bigint>;
  getLinkBalance: () => Promise<bigint>;
  getLinkTokenAddress: () => Promise<string>;
  getPirceStr: (_symbol: string) => Promise<string>;
  getStockCount: () => Promise<bigint>;
  getStockPrice: (_symbol: string) => Promise<[bigint, bigint]>;
  getTokenAddress: (_symbol: string) => Promise<string>;
  getTokenSymbol: (address: string) => Promise<string>;
  isPriceFresh: (_symbol: string) => Promise<boolean>;
  isStockToken: (address: string) => Promise<boolean>;
  jobId: () => Promise<string>;
  owner: () => Promise<string>;
  priceFreshnessLimit: () => Promise<bigint>;
  removeStock: (_symbol: string) => Promise<ethers.ContractTransactionResponse>;
  renounceOwnership: () => Promise<ethers.ContractTransactionResponse>;
  requestPriceUpdate: (
    _symbol: string
  ) => Promise<ethers.ContractTransactionResponse>;
  requestToSymbol: (requestId: string) => Promise<string>;
  sellStock: (
    _symbol: string,
    _amount: bigint
  ) => Promise<ethers.ContractTransactionResponse>;
  setPriceFreshnessLimit: (
    _seconds: bigint
  ) => Promise<ethers.ContractTransactionResponse>;
  simulatePriceUpdate: (
    _symbol: string,
    _price: string
  ) => Promise<ethers.ContractTransactionResponse>;
  stockExists: (_symbol: string) => Promise<boolean>;
  stockPrice: (_symbol: string) => Promise<string>;
  stockTokens: (index: bigint) => Promise<string>;
  stocks: (_symbol: string) => Promise<{
    name: string;
    symbol: string;
    tokenAddress: string;
    price: bigint;
    lastUpdated: bigint;
  }>;
  transferOwnership: (
    newOwner: string
  ) => Promise<ethers.ContractTransactionResponse>;
  transform: (
    _symbol: string,
    _from: string,
    _to: string,
    _amount: bigint
  ) => Promise<ethers.ContractTransactionResponse>;
};

// Helper function to create contract instance
export function createStockContract(
  provider: ethers.Provider | ethers.Signer
): StockContract {
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    provider
  ) as StockContract;
}

// Helper function to get stock data
export async function getStockData(
  contract: StockContract,
  symbol: string,
  userAddress?: string
): Promise<Stock> {
  const stock = await contract.stocks(symbol);
  const priceStr = await contract.getPirceStr(symbol);

  let balance: bigint | undefined;
  if (userAddress) {
    balance = await contract.getBalance(symbol, userAddress);
  }

  return {
    id: 0, // You might want to generate this based on position in array
    name: stock.name,
    symbol: stock.symbol,
    tokenAddress: stock.tokenAddress,
    price: stock.price.toString(),
    priceStr: priceStr,
    lastUpdated: stock.lastUpdated.toString(),
    balance: balance?.toString(),
  };
}

// Helper function to get all stocks
export async function getAllStocks(
  contract: StockContract,
  userAddress?: string
): Promise<Stock[]> {
  const count = await contract.getStockCount();
  const stocks: Stock[] = [];

  for (let i = 0; i < Number(count); i++) {
    const tokenAddress = await contract.stockTokens(i);
    const symbol = await contract.getTokenSymbol(tokenAddress);
    const stock = await getStockData(contract, symbol, userAddress);
    stock.id = i;
    stocks.push(stock);
  }

  return stocks;
}
