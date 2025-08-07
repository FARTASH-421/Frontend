"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AddressDisplay } from "../common/AddressDisplay";
import { RefreshCw, Clock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { StockTrade } from "./StockTrade";
import { ethers } from "ethers";

interface StockCardProps {
  contract: ethers.Contract | null;
  stock: {
    id: number;
    name: string;
    symbol: string;
    tokenAddress: string;
    price: string;
    lastUpdated?: number;
  };
  holdings?: string;
  onRequestPriceUpdate: (symbol: string) => Promise<void>;
  isUpdatingPrice: boolean;
}

export const StockCard = ({
  contract,
  stock,
  holdings = "0",
  onRequestPriceUpdate,
  isUpdatingPrice,
}: StockCardProps) => {
  const [priceStr, setPriceStr] = useState("");
  const [stockPrice, setStockPrice] = useState<[string, string]>(["0", "0"]);
  const [loading, setLoading] = useState(false);
  const [isPriceFresh, setIsPriceFresh] = useState<boolean>(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  function formatTimestamp(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    return `${year}/${month}/${day}, ${hours}:${minutes}:${seconds} ${ampm}`;
  }

  useEffect(() => {
    const handleGetStockPrice = async () => {
      if (!contract || !stock.symbol) return;
      setLoading(true);
      try {
        const price = await contract.getStockPrice(stock.symbol);
        const isFresh = await contract.isPriceFresh(stock.symbol);
        setIsPriceFresh(isFresh);
        const timestamp = Number(price[1]);
        setStockPrice([price[0], formatTimestamp(timestamp)]);
      } catch (error) {
        console.error("Error fetching stock price:", error);
        toast.error("Failed to get stock price");
      } finally {
        setLoading(false);
      }
    };

    const handleGetPriceStr = async () => {
      if (!contract || !stock.symbol) return;
      setLoading(true);
      try {
        const price = await contract.getPirceStr(stock.symbol);
        setPriceStr(price);
      } catch (error) {
        console.error("Error fetching price string:", error);
        toast.error("Failed to get price string");
      } finally {
        setLoading(false);
      }
    };

    handleGetPriceStr();
    handleGetStockPrice();
  }, [contract]);

  const hasHoldings = Number(holdings) > -1;

  const handlePriceUpdate = async () => {
    try {
      await onRequestPriceUpdate(stock.symbol);
    } catch (error: any) {
      toast.error("Failed to request price update");
    }
  };

  return (
    <Card className="bg-gray-900/50 rounded-xl p-6 border border-white/20 felx flex-col justify-between">
      <CardHeader className="p-0 pb-4 flex-row justify-between items-start">
        <div>
          <CardTitle className="text-xl font-bold text-white">
            {stock.symbol}
          </CardTitle>
          <p className="text-amber-500">{stock.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-4">
            <div className="text-xs text-gray-400">
              <Clock className="inline h-3 w-3 mr-1" />
              Time: <span className="text-gray-300">{stockPrice[1]} </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <AddressDisplay address={stock.tokenAddress} />

        {hasHoldings && (
          <div className="my-3 p-1 bg-blue-500/10 rounded-xl">
            <div className="flex px-4 items-center justify-between">
              <span
                className={`${
                  isPriceFresh ? "text-green-400" : "text-yellow-400"
                } font-medium`}
              >
                ${Number(holdings) > 0 ? priceStr : "0"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePriceUpdate}
                disabled={isUpdatingPrice}
                className="h-10 w-25"
              >
                <span className="text-lg mx-1">Refresh</span>
                <RefreshCw
                  className={`h-5 w-5 ${isUpdatingPrice ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <StockTrade contract={contract} stock={stock} />
        </div>
      </CardContent>
    </Card>
  );
};
