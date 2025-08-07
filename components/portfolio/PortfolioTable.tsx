"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { BarChart2, Loader2 } from "lucide-react";
import { AddressDisplay } from "../common/AddressDisplay";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SepoliaWalletOverview } from "./FaucetTokenBalance";
import { ethers } from "ethers";
import { StockTrade } from "../stocks/StockTrade";
import StockQuoteFetcher from "./StockQuoteFetcher";

interface PortfolioTableProps {
  contract: ethers.Contract | null;
  signer: ethers.Signer | null;
  stocks: {
    id: number;
    name: string;
    symbol: string;
    tokenAddress: string;
  }[];
  holdings: Record<string, string>;
  loading: boolean;
  onSell: (id: number, address: string, amount: string) => void;
  sellErrors: Record<number, string | null>;
  sellingLoading: boolean;
}

export const PortfolioTable = ({
  contract,
  signer,
  stocks,
  holdings,
  loading,
  onSell,
  sellErrors,
  sellingLoading,
}: PortfolioTableProps) => {
  const uniqueStocksHeld = stocks.filter(
    (stock) => Number(holdings[stock.tokenAddress] || "0") > 0
  );

  return (
    <div>
      <div className="my-4">
        <SepoliaWalletOverview />
      </div>
      <Card className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        <CardHeader className="flex items-center mb-6 p-0">
          <BarChart2 className="h-6 w-6 mr-3 text-blue-400" />
          <CardTitle className="text-2xl font-bold text-white">
            My Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="animate-spin h-12 w-12 border-b-2 border-purple-500 mb-4" />
              <p className="text-gray-400">Loading portfolio data...</p>
            </div>
          ) : uniqueStocksHeld.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <BarChart2 className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">
                You don't own any stocks yet.
              </p>
              <p className="text-gray-500 mt-2">
                Buy some stocks from the Stocks tab to build your portfolio.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="mb-4 text-center text-gray-300">
                You currently hold{" "}
                <span className="font-semibold text-white">
                  {uniqueStocksHeld.length}
                </span>{" "}
                unique stock{uniqueStocksHeld.length !== 1 ? "s" : ""} in your
                portfolio.
              </div>
              <StockTrade contract={contract} stock={stocks} />
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
                      Token Address
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Holdings
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uniqueStocksHeld.map((stock) => (
                    <TableRow
                      key={stock.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                    >
                      <TableCell className="py-4 px-4">
                        <div className="text-white font-medium">
                          {stock.name}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <span className="text-purple-400 font-semibold">
                          {stock.symbol}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <AddressDisplay
                          address={stock.tokenAddress}
                          showLink={false}
                        />
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <span className="text-white font-semibold">
                          {holdings[stock.tokenAddress]} shares
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Amount"
                            min="1"
                            max={Number(holdings[stock.tokenAddress])}
                            className="w-20 px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            id={`portfolio-sell-input-${stock.id}`}
                          />
                          <Button
                            onClick={() => {
                              const input = document.getElementById(
                                `portfolio-sell-input-${stock.id}`
                              ) as HTMLInputElement;
                              if (input && input.value) {
                                onSell(
                                  stock.id,
                                  stock.tokenAddress,
                                  input.value
                                );
                                input.value = "";
                              }
                            }}
                            disabled={sellingLoading}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded text-sm transition-all duration-200 disabled:opacity-50"
                          >
                            {sellingLoading ? "Selling..." : "Sell"}
                          </Button>
                        </div>
                        {sellErrors[stock.id] && (
                          <div className="text-red-400 text-sm mt-2">
                            {sellErrors[stock.id]}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
