"use client";

import { AddStockForm } from "./AddStockForm";
import { UpdatePriceForm } from "./UpdatePriceForm";
import { RemoveStockForm } from "./RemoveStockForm";
import { ChangeOwnerForm } from "./ChangeOwnerForm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { StockInfo } from "./StockInfo";
import { TokenTransform } from "./TokenTransform";
import { SetPriceFreshnessLimit } from "./setPriceFreshnessLimit";
import StockQuoteFetcher from "../portfolio/StockQuoteFetcher";

interface OwnerControlsProps {
  contract: ethers.Contract | null;
  signer: ethers.Signer | null;
  onStockAdded: () => void;
  onPriceUpdated: () => void;
  onStockRemoved: () => void;
}

export const OwnerControls = ({
  contract,
  signer,
  onStockAdded,
  onPriceUpdated,
  onStockRemoved,
}: OwnerControlsProps) => {
  const [addStockLoading, setAddStockLoading] = useState(false);
  const [updatePriceLoading, setUpdatingPriceLoading] = useState(false);
  const [removeStockLoading, setRemovingStockLoading] = useState(false);
  const [changeOwnerLoading, setChangeOwnerLoading] = useState(false);
  const [addStockError, setAddStockError] = useState<string>("");
  const [updatePriceErrors, setUpdatePriceErrors] = useState<
    Record<number, string | null>
  >({});
  const [removeStockError, setRemoveStockError] = useState<string>("");
  const [changeOwnerError, setChangeOwnerError] = useState<string>("");
  const [stocks, setStocks] = useState<
    {
      id: number;
      name: string;
      symbol: string;
      tokenAddress: string;
      price: string;
    }[]
  >([]);

  // Fetch stocks when component mounts
  useEffect(() => {
    const fetchStocks = async () => {
      if (!contract) return;

      try {
        const stockCount = Number(await contract.getStockCount());

        const stocksData = [];
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
          } catch (error) {
            console.warn(`Error fetching stock ${symbol}:`, error);
            continue; // Skip problematic stocks
          }
        }

        setStocks(stocksData);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    fetchStocks();
  }, [contract]);

  const handleAddStock = async (name: string, symbol: string) => {
    if (!contract || !signer) {
      const errorMsg = "Wallet not connected or contract not initialized.";
      setAddStockError(errorMsg.slice(0, 45) + "...");
      toast.error(errorMsg);
      return;
    }

    try {
      setAddStockLoading(true);
      setAddStockError("");
      toast.loading("Adding stock...", { id: "add-stock" });

      const tx = await contract.addStock(symbol, name);
      await tx.wait();

      toast.success("Stock added successfully!", { id: "add-stock" });
      onStockAdded();
    } catch (error: any) {
      console.error("Error adding stock:", error);
      const errorMsg = `Failed to add stock: ${
        error.reason || error.message || "Unknown error"
      }`;
      setAddStockError(errorMsg);
      toast.error(errorMsg, { id: "add-stock" });
    } finally {
      setAddStockLoading(false);
    }
  };

  const handleUpdatePrice = async (
    id: number,
    symbol: string,
    newPrice: string
  ) => {
    if (!contract || !signer) {
      setUpdatePriceErrors((prev) => ({
        ...prev,
        [id]: "Wallet not connected or contract not initialized.",
      }));
      return;
    }

    try {
      setUpdatingPriceLoading(true);
      setUpdatePriceErrors((prev) => ({ ...prev, [id]: null }));
      toast.loading("price updating stock...", { id: "priceUpdate-stock" });
      const tx = await contract.simulatePriceUpdate(
        symbol,
        ethers.parseEther(newPrice)
      );
      await tx.wait();
      toast.success("price update successfully!", { id: "priceUpdate-stock" });
      onPriceUpdated();
    } catch (error: any) {
      console.error("Error updating price:", error);
      setUpdatePriceErrors((prev) => ({
        ...prev,
        [id]: `Failed to update price: ${
          error.reason || error.message || "Unknown error"
        }`,
      }));
    } finally {
      setUpdatingPriceLoading(false);
    }
  };

  const handleRemoveStock = async (address: string) => {
    if (!contract || !signer) {
      setRemoveStockError("Wallet not connected or contract not initialized.");
      return;
    }

    try {
      setRemovingStockLoading(true);
      setRemoveStockError("");
      toast.loading("Removing stock...", { id: "remove-stock" });

      const tx = await contract.removeStock(address);
      await tx.wait();
      toast.success("Stock remove successfully!", { id: "remove-stock" });
      onStockRemoved();
    } catch (error: any) {
      console.error("Error removing stock:", error);
      toast.error(error, { id: "remove-stock" });
      setRemoveStockError(
        `Failed to remove stock: ${
          error.reason || error.message || "Unknown error"
        }`
      );
    } finally {
      setRemovingStockLoading(false);
    }
  };

  const handleChangeOwner = async (newOwnerAddress: string) => {
    if (!contract || !signer) {
      const errorMsg = "Wallet not connected or contract not initialized.";
      setChangeOwnerError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!ethers.isAddress(newOwnerAddress)) {
      setChangeOwnerError("Invalid Ethereum address");
      return;
    }

    try {
      setChangeOwnerLoading(true);
      setChangeOwnerError("");
      toast.loading("Transferring ownership...", { id: "change-owner" });

      const tx = await contract.transferOwnership(newOwnerAddress);
      const currentOwner = await contract.owner();
      console.log("Current Owner:", currentOwner);
      await tx.wait();

      toast.success("Ownership transferred successfully!", {
        id: "change-owner",
      });
    } catch (error: any) {
      console.error("Error transferring ownership:", error);
      const errorMsg = `Failed to transfer ownership: ${
        error.reason || error.message || "Unknown error"
      }`;
      setChangeOwnerError(errorMsg);
      toast.error(errorMsg, { id: "change-owner" });
    } finally {
      setChangeOwnerLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1  gap-4">
      {/* Left Column - Stock Information */}

      {/* Right Column - Owner Controls */}
      <Card className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        <CardHeader className="flex justify-between">
          <div className="flex items-center mb-6 p-0">
            <Settings className="h-6 w-6 mr-3 text-yellow-400" />
            <CardTitle className="text-2xl font-bold text-white">
              Owner Controls
            </CardTitle>
          </div>
          <div className="">
            <StockQuoteFetcher />
          </div>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <div className=" grid grid-cols-2 gap-4">
            <AddStockForm
              onSubmit={handleAddStock}
              loading={addStockLoading}
              error={addStockError}
            />
            <RemoveStockForm
              onSubmit={handleRemoveStock}
              loading={removeStockLoading}
              error={removeStockError}
            />
          </div>

          <div className=" grid grid-cols-2 gap-4">
            <StockInfo contract={contract} />
            <TokenTransform
              contract={contract}
              signer={signer}
              onTransform={() => {
                // Optional callback after successful transfer
                // Could trigger a balance refresh or other action
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ChangeOwnerForm
              onSubmit={handleChangeOwner}
              loading={changeOwnerLoading}
              error={changeOwnerError}
            />
            <SetPriceFreshnessLimit
              contract={contract}
              refresh={() => console.log("Limit updated!")}
            />
          </div>
          {stocks.length > 0 && (
            <UpdatePriceForm
              stocks={stocks}
              onUpdate={handleUpdatePrice}
              loading={updatePriceLoading}
              errors={updatePriceErrors}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
