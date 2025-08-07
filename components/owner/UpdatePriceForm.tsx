"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

interface UpdatePriceFormProps {
  stocks: {
    id: number;
    name: string;
    symbol: string;
    tokenAddress: string;
    price: string;
  }[];
  onUpdate: (id: number, address: string, newPrice: string) => Promise<void>;
  loading: boolean;
  errors: Record<number, string | null>;
}

export const UpdatePriceForm = ({
  stocks,
  onUpdate,
  loading,
  errors,
}: UpdatePriceFormProps) => {
  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});
  const [currentlyUpdatingId, setCurrentlyUpdatingId] = useState<number | null>(
    null
  );

  const handlePriceChange = (id: number, value: string) => {
    setPriceInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (id: number, symbol: string) => {
    if (!priceInputs[id]) return;

    setCurrentlyUpdatingId(id);
    try {
      await onUpdate(id, symbol, priceInputs[id]);
      handlePriceChange(id, ""); // Clear input after successful update
    } finally {
      setCurrentlyUpdatingId(null);
    }
  };

  return (
    <div className="bg-white/5 rounded-xl p-6 mt-6">
      <h2 className="text-lg font-bold text-white mb-6 flex items-center">
        <TrendingUp className="h-6 w-6 mr-3 text-yellow-400" />
        Update Stock Prices
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/20">
              <TableHead className="text-left py-3 px-4 text-gray-300 font-semibold">
                Stock
              </TableHead>
              <TableHead className="text-left py-3 px-4 text-gray-300 font-semibold">
                Symbol
              </TableHead>
              <TableHead className="text-left py-3 px-4 text-gray-300 font-semibold">
                Current Price
              </TableHead>
              <TableHead className="text-left py-3 px-4 text-gray-300 font-semibold">
                New Price
              </TableHead>
              <TableHead className="text-left py-3 px-4 text-gray-300 font-semibold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => {
              const isUpdating = currentlyUpdatingId === stock.id;
              return (
                <TableRow
                  key={stock.id}
                  className="border-b border-white/10 hover:bg-blue-300/20 transition-colors duration-200"
                >
                  <TableCell className="py-4 px-4">
                    <div className="text-white font-medium">{stock.name}</div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <span className="text-purple-400 font-semibold">
                      {stock.symbol}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <span className="text-green-400 font-semibold">
                      ${stock.price}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <Input
                      type="number"
                      placeholder="New price"
                      step="0.01"
                      min="0.01"
                      value={priceInputs[stock.id] || ""}
                      onChange={(e) =>
                        handlePriceChange(stock.id, e.target.value)
                      }
                      className="w-32 px-3 py-2 bg-none border border-white/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={isUpdating}
                    />
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleUpdate(stock.id, stock.symbol)}
                        disabled={
                          isUpdating ||
                          !priceInputs[stock.id] ||
                          currentlyUpdatingId !== null // Disable all buttons when any is updating
                        }
                        className={`bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-black font-semibold py-2 px-4 rounded transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 text-sm ${
                          isUpdating ? "animate-pulse" : ""
                        }`}
                      >
                        {isUpdating ? "Updating..." : "Update"}
                      </Button>
                      {errors[stock.id] && (
                        <div className="text-red-400 text-sm mt-2">
                          {errors[stock.id]}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
