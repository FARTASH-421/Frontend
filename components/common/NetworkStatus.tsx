import { CheckCircle, XCircle } from "lucide-react";
import { Network } from "ethers";

interface NetworkStatusProps {
  network: Network;
}

export const NetworkStatus = ({ network }: NetworkStatusProps) => (
  <div className="max-w-4xl mx-auto mb-6">
    <div
      className={`text-center p-3 rounded-lg ${
        network.chainId === 11155111n
          ? "bg-green-500/20 text-green-300"
          : "bg-red-500/20 text-red-300"
      } border ${
        network.chainId === 11155111n
          ? "border-green-500/50"
          : "border-red-500/50"
      }`}
    >
      <div className="flex items-center justify-center">
        {network.chainId === 11155111n ? (
          <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
        ) : (
          <XCircle className="w-4 h-4 mr-2 text-red-400" />
        )}
        <span>
          {network.chainId === 11155111n
            ? "Connected to Sepolia Testnet"
            : `Connected to Network ${network.chainId} - Please switch to Sepolia`}
        </span>
      </div>
    </div>
  </div>
);
