import { useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowRight, ArrowUpDown, Check, X, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

interface TokenTransformProps {
  contract: ethers.Contract | null;
  signer: ethers.Signer | null;
  onTransform?: () => void;
}

export const TokenTransform = ({
  contract,
  signer,
  onTransform,
}: TokenTransformProps) => {
  const [symbol, setSymbol] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!symbol.trim()) {
      toast.error("Token symbol is required", {
        icon: <AlertTriangle className="text-yellow-500" />,
      });
      return false;
    }

    if (!ethers.isAddress(fromAddress)) {
      toast.error("Invalid 'From' address", {
        icon: <X className="text-red-500" />,
      });
      return false;
    }

    if (!ethers.isAddress(toAddress)) {
      toast.error("Invalid 'To' address", {
        icon: <X className="text-red-500" />,
      });
      return false;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount", {
        icon: <AlertTriangle className="text-yellow-500" />,
      });
      return false;
    }

    return true;
  };

  const handleTransform = async () => {
    if (!contract || !signer) {
      toast.error("Wallet not connected", {
        icon: <X className="text-red-500" />,
      });
      return;
    }

    if (!validateInputs()) return;

    const toastId = toast.loading(
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-5 w-5 animate-pulse" />
        Processing transfer...
      </div>,
      {
        duration: Infinity,
      }
    );

    try {
      setLoading(true);

      // Adjust decimals based on your token requirements
      const decimals = 18;
      const parsedAmount = ethers.parseUnits(amount, decimals);

      const tx = await contract.transform(
        symbol,
        fromAddress,
        toAddress,
        parsedAmount
      );
      const receipt = await tx.wait();

      toast.success(
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          <div>
            <p>Transfer successful!</p>
            <p className="text-sm text-gray-500">
              {symbol}: {amount} from {fromAddress.slice(0, 6)}... to{" "}
              {toAddress.slice(0, 6)}...
            </p>
          </div>
        </div>,
        { id: toastId, duration: 5000 }
      );

      // Reset form
      setSymbol("");
      setFromAddress("");
      setToAddress("");
      setAmount("");

      if (onTransform) onTransform();
    } catch (error: any) {
      console.error("Transfer failed:", error);

      let errorMessage = "Transfer failed";
      if (error.reason) {
        errorMessage = error.reason.replace("execution reverted: ", "");
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(
        <div className="flex items-center gap-2">
          <X className="h-5 w-5 text-red-500" />
          <div>
            <p>{errorMessage}</p>
            <p className="text-sm text-gray-500">Please try again</p>
          </div>
        </div>,
        { id: toastId, duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasteFromAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (ethers.isAddress(text)) {
        setFromAddress(text);
        toast.success("Address pasted successfully", {
          icon: <Check className="h-5 w-5 text-green-500" />,
        });
      } else {
        toast.error("Clipboard doesn't contain a valid address", {
          icon: <X className="h-5 w-5 text-red-500" />,
        });
      }
    } catch (error) {
      toast.error("Failed to read clipboard", {
        icon: <X className="h-5 w-5 text-red-500" />,
      });
    }
  };

  const handlePasteToAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (ethers.isAddress(text)) {
        setToAddress(text);
        toast.success("Address pasted successfully", {
          icon: <Check className="h-5 w-5 text-green-500" />,
        });
      } else {
        toast.error("Clipboard doesn't contain a valid address", {
          icon: <X className="h-5 w-5 text-red-500" />,
        });
      }
    } catch (error) {
      toast.error("Failed to read clipboard", {
        icon: <X className="h-5 w-5 text-red-500" />,
      });
    }
  };

  return (
    <Card className="bg-gray-900 border border-gray-700 rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <ArrowUpDown className="h-5 w-5 text-blue-400" />
          Token Transfer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-4">
          {/* Token Symbol */}
          <div className="space-y-1">
            <Label htmlFor="symbol" className="text-gray-300">
              Token Symbol
            </Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="LINK"
              disabled={loading}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* From Address */}
          <div className="space-y-1">
            <Label htmlFor="from" className="text-gray-300">
              From
            </Label>
            <div className="flex gap-2">
              <Input
                id="from"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                placeholder="0x..."
                disabled={loading}
                className="bg-gray-800 border-gray-700 text-white flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handlePasteFromAddress}
                className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
              >
                Paste
              </Button>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        {/* Amount */}
        <div className="space-y-1">
          <Label htmlFor="amount" className="text-gray-300">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            disabled={loading}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {/* To Address */}
        <div className="space-y-1">
          <Label htmlFor="to" className="text-gray-300">
            To
          </Label>
          <div className="flex gap-2">
            <Input
              id="to"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              disabled={loading}
              className="bg-gray-800 border-gray-700 text-white flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handlePasteToAddress}
              className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
            >
              Paste
            </Button>
          </div>
        </div>

        {/* Row 3 (Button) */}
        <Button
          onClick={handleTransform}
          disabled={loading}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Transfer Tokens
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
