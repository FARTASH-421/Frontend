"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WalletConnection } from "@/components/wallet/WalletConnection";
import { WalletDisconnect } from "@/components/wallet/WalletDisconnect";
import { StockList } from "@/components/stocks/StockList";
import { PortfolioTable } from "@/components/portfolio/PortfolioTable";
import { OwnerControls } from "@/components/owner/OwnerControls";
import { NetworkStatus } from "@/components/common/NetworkStatus";
import { useWallet } from "@/hooks/useWallet";
import { useStocks } from "@/hooks/useStocks";
import toast from "react-hot-toast"; // ✅ Fixed import

export default function Home() {
  const {
    provider,
    signer,
    contract,
    account,
    network,
    isOwner,
    loading: walletLoading,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  const {
    stocks,
    userHoldings,
    loading: stocksLoading,
    fetchStocks,
    handleBuyStock,
    handleSellStock,
    buyStockErrors,
    sellStockErrors,
    buyingStockLoading,
    sellingStockLoading,
  } = useStocks({ contract, account });

  const [updatingPrices, setUpdatingPrices] = useState<Record<string, boolean>>(
    {}
  );
  const [lastUpdateRequest, setLastUpdateRequest] = useState<number>(0);

  const handleRequestPriceUpdate = async (symbol: string) => {
    if (!contract) {
      toast.error("Wallet not connected");
      return;
    }

    const now = Date.now();
    if (now - lastUpdateRequest < 30000) {
      toast("You can only request price updates every 30 seconds");
      return;
    }

    try {
      setUpdatingPrices((prev) => ({ ...prev, [symbol]: true }));
      setLastUpdateRequest(now);
      const balance = await contract.fee();
      if (balance < 1) {
        console.error("Dose not enagh Token!");
        return;
      }

      const tx = await contract.requestPriceUpdate(symbol);
      toast.loading("Requesting price update...", { id: "add-stock" });
      await tx.wait();
      toast.success("Price update requested. It may take a few minutes.", {
        id: "add-stock",
      });

      setTimeout(() => {
        fetchStocks();
        toast.success("Stock prices have been updated");
      }, 10000);
    } catch (error: any) {
      console.error("Price update failed: -> ", error);
      toast.error(
        error?.reason?.replace("execution reverted: ", "") ||
          "Failed to request price update"
      );
    } finally {
      setUpdatingPrices((prev) => ({ ...prev, [symbol]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-sky-950 flex justify-center items-center">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Web3 Stock Exchange
          </h1>
          <p className="text-xl text-gray-300">
            Decentralized Stock Management on {network?.name || "Ethereum"}
          </p>
        </div>

        {account && network && (
          <NetworkStatus network={network} className="mb-4" />
        )}

        {account ? (
          <WalletDisconnect
            account={account}
            isOwner={isOwner}
            onDisconnect={disconnectWallet}
            className="mb-6"
          />
        ) : (
          <WalletConnection
            loading={walletLoading}
            onConnect={connectWallet}
            className="mb-6"
          />
        )}

        {account && (
          <Tabs defaultValue="stocks" className="max-w-7xl mx-auto">
            <TabsList
              className={`grid w-full h-auto grid-cols-2 ${
                isOwner ? "md:grid-cols-3" : "md:grid-cols-2"
              } bg-white/10 border border-white/20 mb-6`}
            >
              <TabsTrigger value="stocks" className=" text-lg font-semibold">
                Stocks
              </TabsTrigger>
              <TabsTrigger value="portfolio" className=" text-lg font-semibold">
                My Portfolio
              </TabsTrigger>
              {isOwner && (
                <TabsTrigger value="owner" className=" text-lg font-semibold">
                  Owner Controls
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="stocks">
              <StockList
                contract={contract}
                stocks={stocks}
                holdings={userHoldings}
                loading={stocksLoading}
                onRefresh={fetchStocks}
                onRequestPriceUpdate={handleRequestPriceUpdate}
                updatingPrices={updatingPrices}
              />
            </TabsContent>

            <TabsContent value="portfolio">
              <PortfolioTable
                stocks={stocks}
                contract={contract}
                signer={signer}
                holdings={userHoldings}
                loading={stocksLoading}
                onSell={handleSellStock}
                sellErrors={sellStockErrors}
                sellingLoading={sellingStockLoading}
              />
            </TabsContent>

            {isOwner && (
              <TabsContent value="owner">
                <OwnerControls
                  contract={contract}
                  signer={signer}
                  onStockAdded={fetchStocks}
                  onPriceUpdated={fetchStocks}
                  onStockRemoved={fetchStocks}
                />
              </TabsContent>
            )}
          </Tabs>
        )}

        {!account && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Connect your Ethereum wallet to start trading tokenized stocks on
              our decentralized exchange.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
