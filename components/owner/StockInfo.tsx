"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import toast from "react-hot-toast";

interface StockInfoProps {
  contract: ethers.Contract | null;
}

export const StockInfo = ({ contract }: StockInfoProps) => {
  const [symbol, setSymbol] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [stockPrice, setStockPrice] = useState<[string, string]>(["0", "0"]);
  const [stockCount, setStockCount] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const handleGetPriceStr = async () => {
    if (!contract || !symbol) return;
    setLoading(true);
    try {
      const price = await contract.getPirceStr(symbol);
      setPriceStr(price);
    } catch (error) {
      console.error("Error fetching price string:", error);
      toast.error("Failed to get price string");
    } finally {
      setLoading(false);
    }
  };

  const handleGetTokenAddress = async () => {
    if (!contract || !symbol) return;
    setLoading(true);
    try {
      const address = await contract.getTokenAddress(symbol);
      //   toast.loading("Loading...");
      setTokenAddress(address);
    } catch (error) {
      console.error("Error fetching token address:", error);
      toast.error("Failed to get token address");
    } finally {
      setLoading(false);
    }
  };

  const handleGetStockPrice = async () => {
    if (!contract || !symbol) return;
    setLoading(true);
    try {
      const price = await contract.getStockPrice(symbol);

      const timestamp = Number(price[1]);
      setStockPrice([price[0], formatTimestamp(timestamp)]);
    } catch (error) {
      console.error("Error fetching stock price:", error);
      toast.error("Failed to get stock price");
    } finally {
      setLoading(false);
    }
  };

  const handleGetStockCount = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const count = await contract.getStockCount();
      setStockCount(Number(count));
    } catch (error) {
      console.error("Error fetching stock count:", error);
      toast.error("Failed to get stock count");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-cyan-700/20 backdrop-blur-lg rounded-2xl p-8 border border-cyan-600 shadow-2xl">
      <CardHeader className="flex items-center mb-6 p-0">
        <Info className="h-6 w-6 mr-3 text-blue-400" />
        <CardTitle className="text-2xl font-bold text-white">
          Stock Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol" className="text-white/80">
              Stock Symbol
            </Label>
            <div className="flex gap-2">
              <Input
                id="symbol"
                placeholder="e.g. AAPL"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="bg-white/5 border-white/20 text-white flex-1"
              />
              <Button
                onClick={handleGetPriceStr}
                disabled={loading || !symbol}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Get Price
              </Button>
            </div>
          </div>
          {priceStr && (
            <div className="text-white">
              <p>Price String: {priceStr}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGetTokenAddress}
            disabled={loading || !symbol}
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            Get Token Address
          </Button>
          {tokenAddress && (
            <div className="text-white break-all">
              <p>Token Address: {tokenAddress}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGetStockPrice}
            disabled={loading || !symbol}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Get Stock Price Details
          </Button>
          {stockPrice[0] !== "0" && (
            <div className="text-white">
              <p>
                Buy Price:
                <span className="text-gray-400">
                  {" "}
                  {stockPrice[0] + " "} ETH
                </span>
              </p>
              <p>
                Time: <span className="text-gray-400">{stockPrice[1]} </span>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4 grid grid-cols-2 gap-4">
          <Button
            onClick={handleGetStockCount}
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black h-auto"
          >
            Get Stock Count
          </Button>
          {stockCount > 0 && (
            <div className="text-white bg-sky-400/10 rounded-md text-center flex items-center w-38 p-2 h-10">
              <p>Total Stocks: {stockCount}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
