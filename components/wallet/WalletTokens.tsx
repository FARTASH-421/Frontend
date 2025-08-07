// components/TokenList.tsx
"use client";

import { useWallet } from "@/hooks/useWallet";

export const TokenList = () => {
  const { userTokens } = useWallet();

  if (!userTokens.length) {
    return (
      <p className="text-gray-500 text-sm mt-4">No ERC-20 tokens found.</p>
    );
  }

  return (
    <div className="mt-6 space-y-4 w-full max-w-md">
      <h2 className="text-xl font-bold mb-2">💰 ERC-20 Tokens</h2>
      {userTokens.map((token) => (
        <div
          key={token.contractAddress}
          className="border p-4 rounded shadow bg-white"
        >
          <p className="font-semibold">
            {token.name} ({token.symbol})
          </p>
          <p className="text-sm text-gray-600">Balance: {token.balance}</p>
          <p className="text-xs text-gray-400 break-all">
            Contract: {token.contractAddress}
          </p>
        </div>
      ))}
    </div>
  );
};
