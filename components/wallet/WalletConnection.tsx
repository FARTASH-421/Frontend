import { Button } from "../ui/button";
import { Wallet, Loader2 } from "lucide-react";

interface WalletConnectionProps {
  loading: boolean;
  onConnect: () => void;
}

export const WalletConnection = ({
  loading,
  onConnect,
}: WalletConnectionProps) => (
  <div className="text-center ">
    <div className="w-25 h-25 mx-auto mb-6 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
      <Wallet className="h-15 w-15 text-white" />
    </div>
    <h2 className="text-2xl font-semibold text-white mb-4">
      Connect Your Wallet
    </h2>
    <p className="text-gray-300 mb-6">
      Connect your MetaMask wallet to interact with the stock exchange
    </p>
    <Button
      onClick={onConnect}
      disabled={loading}
      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center">
          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
          Connecting...
        </span>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  </div>
);
