import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ShoppingCart,
  ArrowRightLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { ethers } from "ethers";

interface StockTradeProps {
  contract: ethers.Contract | null;
  refresh?: () => void;
  stock: {
    id: number;
    name: string;
    symbol: string;
    tokenAddress: string;
    price: string;
    lastUpdated?: number;
  };
}

export function StockTrade({ contract, refresh, stock }: StockTradeProps) {
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [priceStatus, setPriceStatus] = useState<"fresh" | "stale" | "unknown">(
    "unknown"
  );
  const [checkingStatus, setCheckingStatus] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSymbol(value);

    // Clear previous debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only check price freshness after user stops typing for 1 second
    if (value.trim()) {
      debounceTimer.current = setTimeout(() => {
        checkPriceFreshness(value.trim());
      }, 3000);
    } else {
      setPriceStatus("unknown");
    }
  };

  const checkPriceFreshness = async (symbolToCheck: string) => {
    if (!contract || !symbolToCheck) {
      setPriceStatus("unknown");
      return;
    }

    setCheckingStatus(true);
    try {
      const isFresh = await contract.isPriceFresh(symbolToCheck);
      setPriceStatus(isFresh ? "fresh" : "stale");
    } catch (error) {
      console.error("Error checking price freshness:", error);
      setPriceStatus("unknown");
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleTrade = async () => {
    if (!symbol || !symbol.trim()) {
      toast.error("Please enter a stock symbol", {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        },
      });
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount", {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        },
      });
      return;
    }

    setLoading(true);
    const toastId = toast.loading(
      `Processing ${action === "buy" ? "purchase" : "sale"}...`,
      {
        icon: <Loader2 className="h-5 w-5 animate-spin text-blue-500" />,
        style: {
          background: "#1f2937",
          color: "#fff",
        },
      }
    );

    try {
      const tx =
        action === "buy"
          ? await contract.buyStock(symbol.trim(), Number(amount))
          : await contract.sellStock(symbol.trim(), Number(amount));

      await tx.wait();

      toast.success(
        `${
          action === "buy" ? "Purchased" : "Sold"
        } ${amount} shares of ${symbol.toUpperCase()}`,
        {
          id: toastId,
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        }
      );

      setSymbol("");
      setAmount("");
      refresh?.();
    } catch (err: any) {
      console.log(err);
      toast.error(
        err.message || `${action === "buy" ? "Purchase" : "Sale"} failed`,
        {
          id: toastId,
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (priceStatus) {
      case "fresh":
        return "text-green-400";
      case "stale":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = () => {
    if (checkingStatus) return <Loader2 className="h-4 w-4 animate-spin" />;
    switch (priceStatus) {
      case "fresh":
        return <CheckCircle2 className="h-4 w-4" />;
      case "stale":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    if (checkingStatus) return "Checking price...";
    switch (priceStatus) {
      case "fresh":
        return "Price is fresh";
      case "stale":
        return "Price is not fresh";
      default:
        return symbol ? "Checking price..." : "Enter symbol to check";
    }
  };

  const hasValidInputs =
    symbol.trim() &&
    amount.trim() &&
    !isNaN(Number(amount)) &&
    Number(amount) > 0;

  return (
    <Card className="bg-teal-800 border border-gray-700 rounded-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-white">
            <ArrowRightLeft className="h-5 w-5 text-blue-400" />
            Stock Trade
          </CardTitle>
          <ToggleGroup
            type="single"
            value={action}
            onValueChange={(value) => setAction(value as "buy" | "sell")}
            className="bg-gray-800 rounded-lg p-1"
          >
            <ToggleGroupItem
              value="buy"
              className={`px-3 py-1 text-sm ${
                action === "buy" ? "bg-blue-600 text-white" : "text-gray-300"
              }`}
            >
              Buy
            </ToggleGroupItem>
            <ToggleGroupItem
              value="sell"
              className={`px-3 py-1 text-sm ${
                action === "sell" ? "bg-red-600 text-white" : "text-gray-300"
              }`}
            >
              Sell
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Stock Symbol */}
          <div className="space-y-2">
            <Label htmlFor="symbol" className="text-gray-300">
              Stock Symbol
            </Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={handleSymbolChange}
              placeholder={`${stock.symbol}`}
              disabled={loading || checkingStatus}
              className="bg-gray-800 border-gray-700 text-white uppercase"
              maxLength={5}
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-300">
              Shares
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              disabled={loading || checkingStatus}
              className="bg-gray-800 border-gray-700 text-white"
              min="1"
              step="1"
            />
          </div>
        </div>

        {/* Price Status Indicator */}
        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-800/50">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Conditional render based on price status and inputs */}
        <Button
          onClick={handleTrade}
          disabled={!hasValidInputs || priceStatus !== "fresh" || loading}
          className={`w-full transition-colors ${
            action === "buy"
              ? hasValidInputs && priceStatus === "fresh"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-400/50 text-blue-100"
              : hasValidInputs && priceStatus === "fresh"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-red-400/50 text-red-100"
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {action === "buy" ? (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Buy Shares
                </>
              ) : (
                <>
                  <ArrowRightLeft className="h-4 w-4" />
                  Sell Shares
                </>
              )}
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
