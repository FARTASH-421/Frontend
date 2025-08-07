import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { RefreshCw, TrendingUp } from "lucide-react";
import { StockCard } from "./StockCard";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

interface StockListProps {
  contract: ethers.Contract | null;
  stocks: {
    id: number;
    name: string;
    symbol: string;
    tokenAddress: string;
    price: string;
    lastUpdated?: number;
  }[];
  holdings: Record<string, string>;
  loading: boolean;
  onRefresh: () => void;
  onRequestPriceUpdate: (symbol: string) => Promise<void>;
  updatingPrices: Record<string, boolean>;
  priceFreshnessLimit?: number;
}

export const StockList = ({
  contract,
  stocks: initialStocks,
  holdings: initialHoldings,
  loading,
  onRefresh,
  onRequestPriceUpdate,
  updatingPrices,
}: StockListProps) => {
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [localStocks, setLocalStocks] = useState(initialStocks);
  const [localHoldings, setLocalHoldings] = useState(initialHoldings);

  const handleRefresh = () => {
    const refreshTime = new Date();
    setLastRefreshTime(refreshTime);
    onRefresh();
  };

  // Update local state only when refresh happens or initial load
  useEffect(() => {
    if (!loading) {
      setLocalStocks(initialStocks);
      setLocalHoldings(initialHoldings);
      if (!lastRefreshTime) {
        setLastRefreshTime(new Date());
      }
    }
  }, [loading, initialStocks, initialHoldings]);

  return (
    <Card className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start mb-6 p-0">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 mr-3 text-green-400" />
          <div>
            <CardTitle className="text-2xl font-bold text-white">
              Available Stocks
            </CardTitle>
            {!loading && localStocks.length > 0 && lastRefreshTime && (
              <p className="text-sm text-gray-400 mt-1">
                Last refreshed {formatDistanceToNow(lastRefreshTime)} ago
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="mt-2 sm:mt-0 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border-white/20"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="bg-white/10 rounded-xl p-6 border border-white/20 animate-pulse"
              >
                <div className="h-6 w-3/4 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 w-1/2 bg-gray-700 rounded mb-6"></div>
                <div className="h-10 w-full bg-gray-700 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-700 rounded"></div>
              </Card>
            ))}
          </div>
        ) : localStocks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">No stocks available yet.</p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="mt-4 bg-white/10 text-gray-300 hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Again
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {localStocks.map((stock) => (
              <StockCard
                key={stock.id}
                contract={contract}
                stock={stock}
                holdings={localHoldings[stock.tokenAddress]}
                onRequestPriceUpdate={onRequestPriceUpdate}
                isUpdatingPrice={updatingPrices[stock.symbol] || false}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
