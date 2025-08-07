"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CopyPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

interface AddStockFormProps {
  onSubmit: (name: string, symbol: string) => Promise<void>;
  loading: boolean;
  error?: string;
}

export const AddStockForm = ({
  onSubmit,
  loading,
  error,
}: AddStockFormProps) => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(name, symbol);
    setName("");
    setSymbol("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-fuchsia-400/15 rounded-xl p-6 border border-fuchsia-600"
    >
      <div className="">
        <div className="flex gap-4">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <CopyPlus className="h-5 w-5 mr-3 text-blue-500" />
            Add New Stock
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="stock-name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Stock Name
            </Label>
            <Input
              id="stock-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-red-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              placeholder="e.g., Apple"
              required
            />
          </div>
          <div>
            <Label
              htmlFor="stock-symbol"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Stock Symbol
            </Label>
            <Input
              id="stock-symbol"
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20  rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              placeholder="e.g., APPL"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="mt-4 w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Adding..." : "Add New Stock"}
        </Button>
        {error && (
          <div className="text-red-500 text-sm mt-4 overflow-x-hidden bg-white/50 px-4 py-2 rounded-xl">
            {error}
          </div>
        )}
      </div>
    </form>
  );
};
