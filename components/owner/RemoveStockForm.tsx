import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface RemoveStockFormProps {
  onSubmit: (address: string) => Promise<void>;
  loading: boolean;
  error?: string;
}

export const RemoveStockForm = ({
  onSubmit,
  loading,
  error,
}: RemoveStockFormProps) => {
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(address);
    setAddress("");
  };

  return (
    <div className="bg-sky-400/10 rounded-xl p-6 border border-sky-600">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Trash2 className="h-5 w-5 mr-2 text-red-400" />
        Remove Stock
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="remove-stock-address"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Stock Token Address
          </Label>
          <Input
            id="remove-stock-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white   placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter token address (0x...)"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Removing..." : "Remove Stock"}
        </Button>
        {error && (
          <div className="text-red-400 text-sm mt-2 font-medium">{error}</div>
        )}
      </form>
    </div>
  );
};
