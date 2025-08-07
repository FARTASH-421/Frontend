"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";

interface UseStocksProps {
  contract: ethers.Contract | null;
  account: string | null;
}

export const useStocks = ({ contract, account }: UseStocksProps) => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [userHoldings, setUserHoldings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [buyingStockLoading, setBuyingStockLoading] = useState(false);
  const [sellingStockLoading, setSellingStockLoading] = useState(false);
  const [buyStockErrors, setBuyStockErrors] = useState<
    Record<number, string | null>
  >({});
  const [sellStockErrors, setSellStockErrors] = useState<
    Record<number, string | null>
  >({});

  const fetchStocks = useCallback(async () => {
    if (!contract) return;

    setLoading(true);
    try {
      const stockCount = Number(await contract.getStockCount());
      const stocksData = [];
      const holdings: Record<string, string> = {};
      const addrs = await contract.getAllStockTokens();
      let symbol = "";

      // Then fetch each stock's data
      for (const a of addrs) {
        try {
          const symbol = await contract.getTokenSymbol(a);
          const stock = await contract.stocks(symbol);
          stocksData.push({
            id: stocksData.length, // sequential ID
            name: stock.name,
            symbol: stock.symbol,
            tokenAddress: stock.tokenAddress,
            price: ethers.formatEther(stock.price),
          });

          if (account) {
            const balance = stock.price;
            holdings[stock.tokenAddress] = ethers.formatUnits(balance, 0);
          }
        } catch (error) {
          console.warn(`Error fetching stock ${symbol}:`, error);
          continue; // Skip problematic stocks
        }
      }

      setStocks(stocksData);
      setUserHoldings(holdings);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      toast.error("Failed to fetch stock data. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  useEffect(() => {
    fetchStocks();

    // Set up polling
    // const interval = setInterval(fetchStocks, 60000);
    // return () => clearInterval(interval);
  }, [fetchStocks]);

  const handleBuyStock = useCallback(
    async (id: number, address: string, price: string) => {
      if (!contract) {
        setBuyStockErrors((prev) => ({
          ...prev,
          [id]: "Wallet not connected or contract not initialized.",
        }));
        return;
      }

      try {
        setBuyingStockLoading(true);
        setBuyStockErrors((prev) => ({ ...prev, [id]: null }));
        const tx = await contract.buyStock(address, {
          value: ethers.parseEther(price),
        });
        await tx.wait();
        fetchStocks();
      } catch (error: any) {
        console.error("Error buying stock:", error);
        setBuyStockErrors((prev) => ({
          ...prev,
          [id]: `Failed to purchase stock: ${
            error.reason || error.message || "Unknown error"
          }`,
        }));
      } finally {
        setBuyingStockLoading(false);
      }
    },
    [contract, fetchStocks]
  );

  const handleSellStock = useCallback(
    async (id: number, address: string, amount: string) => {
      if (!contract) {
        setSellStockErrors((prev) => ({
          ...prev,
          [id]: "Wallet not connected or contract not initialized.",
        }));
        return;
      }

      try {
        setSellingStockLoading(true);
        setSellStockErrors((prev) => ({ ...prev, [id]: null }));
        const tx = await contract.sellStock(
          address,
          ethers.parseUnits(amount, 0)
        );
        await tx.wait();
        fetchStocks();
      } catch (error: any) {
        console.error("Error selling stock:", error);
        setSellStockErrors((prev) => ({
          ...prev,
          [id]: `Failed to sell stock: ${
            error.reason || error.message || "Unknown error"
          }`,
        }));
      } finally {
        setSellingStockLoading(false);
      }
    },
    [contract, fetchStocks]
  );

  return {
    stocks,
    userHoldings,
    loading,
    fetchStocks,
    handleBuyStock,
    handleSellStock,
    buyStockErrors,
    sellStockErrors,
    buyingStockLoading,
    sellingStockLoading,
  };
};
