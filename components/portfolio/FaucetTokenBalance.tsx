import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Coins, Wallet, Trash2, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface TokenBalance {
  address: string;
  symbol: string;
  balance: string;
  formattedBalance: string;
  decimals: number;
  isNative: boolean;
}

export const SepoliaWalletOverview = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string>("");
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [customTokenAddress, setCustomTokenAddress] = useState<string>("");

  // Sepolia token addresses
  const SEPOLIA_TOKENS = {
    ETH: {
      address: ethers.ZeroAddress,
      symbol: "ETH",
      decimals: 18,
      isNative: true,
    },
    LINK: {
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      symbol: "LINK",
      decimals: 18,
      isNative: false,
    },
  };

  // Add token to MetaMask wallet
  const addTokenToMetaMask = async (
    tokenAddress: string,
    tokenSymbol: string,
    tokenDecimals: number
  ) => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      });

      if (!wasAdded) {
        console.log("User declined to add token to MetaMask");
      }
    } catch (error) {
      console.error("Error adding token to MetaMask:", error);
    }
  };

  // Load custom tokens from localStorage with duplicate prevention
  const loadCustomTokens = (): TokenBalance[] => {
    try {
      const savedTokens = localStorage.getItem("sepoliaCustomTokens");
      if (!savedTokens) return [];

      const parsed = JSON.parse(savedTokens);
      const uniqueTokens = new Map<string, TokenBalance>();

      parsed.forEach((token: any) => {
        const addressLower = token.address.toLowerCase();
        if (!uniqueTokens.has(addressLower)) {
          uniqueTokens.set(addressLower, {
            ...token,
            formattedBalance: ethers.formatUnits(token.balance, token.decimals),
          });
        }
      });

      return Array.from(uniqueTokens.values());
    } catch (err) {
      console.error("Error loading tokens:", err);
      return [];
    }
  };

  // Save custom tokens to localStorage with duplicate prevention
  const saveCustomTokens = (tokens: TokenBalance[]) => {
    try {
      const customTokens = tokens
        .filter((token) => !token.isNative)
        .reduce((acc, token) => {
          const addressLower = token.address.toLowerCase();
          if (!acc.some((t) => t.address.toLowerCase() === addressLower)) {
            acc.push({
              address: token.address,
              symbol: token.symbol,
              balance: token.balance,
              decimals: token.decimals,
              isNative: false,
            });
          }
          return acc;
        }, [] as any[]);

      localStorage.setItem("sepoliaCustomTokens", JSON.stringify(customTokens));
    } catch (err) {
      console.error("Error saving tokens:", err);
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError("");

      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 11155111n) {
        throw new Error("Please connect to Sepolia testnet");
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAddress(address);

      await fetchBalances(provider, address);
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  const fetchBalances = async (
    provider: ethers.BrowserProvider,
    address: string
  ) => {
    try {
      setLoading(true);
      setError("");

      const customTokens = loadCustomTokens();
      const allTokens = [...Object.values(SEPOLIA_TOKENS), ...customTokens];

      const balancePromises = allTokens.map(async (token) => {
        try {
          if (token.isNative) {
            const balance = await provider.getBalance(address);
            return {
              ...token,
              balance: balance.toString(),
              formattedBalance: ethers.formatEther(balance),
            };
          } else {
            const contract = new ethers.Contract(
              token.address,
              ["function balanceOf(address) view returns (uint256)"],
              provider
            );
            const balance = await contract.balanceOf(address);
            return {
              ...token,
              balance: balance.toString(),
              formattedBalance: ethers.formatUnits(balance, token.decimals),
            };
          }
        } catch (err) {
          console.error(`Error fetching ${token.symbol} balance:`, err);
          return {
            ...token,
            balance: "0",
            formattedBalance: "0",
            error: true,
          };
        }
      });

      const tokenBalances = await Promise.all(balancePromises);
      const uniqueBalances = tokenBalances.filter(
        (token, index, self) =>
          index ===
          self.findIndex(
            (t) => t.address.toLowerCase() === token.address.toLowerCase()
          )
      );
      setBalances(uniqueBalances);
    } catch (err: any) {
      console.error("Error fetching balances:", err);
      setError(err.message || "Failed to fetch balances");
    } finally {
      setLoading(false);
    }
  };

  const addCustomToken = async () => {
    if (!customTokenAddress || !provider || !address) return;

    try {
      setLoading(true);
      setError("");

      if (!ethers.isAddress(customTokenAddress)) {
        throw new Error("Invalid Ethereum address");
      }

      const addressLower = customTokenAddress.toLowerCase();
      if (balances.some((t) => t.address.toLowerCase() === addressLower)) {
        throw new Error("Token already added");
      }

      const code = await provider.getCode(customTokenAddress);
      if (code === "0x") {
        throw new Error("No contract at this address");
      }

      const contract = new ethers.Contract(
        customTokenAddress,
        [
          "function balanceOf(address) view returns (uint256)",
          "function symbol() view returns (string)",
          "function decimals() view returns (uint8)",
        ],
        provider
      );

      const [balance, symbol, decimals] = await Promise.all([
        contract.balanceOf(address),
        contract.symbol(),
        contract.decimals(),
      ]);

      const newToken: TokenBalance = {
        address: customTokenAddress,
        symbol,
        balance: balance.toString(),
        formattedBalance: ethers.formatUnits(balance, decimals),
        decimals: Number(decimals),
        isNative: false,
      };

      const updatedBalances = [
        ...balances.filter((t) => t.address.toLowerCase() !== addressLower),
        newToken,
      ];

      setBalances(updatedBalances);
      saveCustomTokens(updatedBalances);
      setCustomTokenAddress("");

      // Add token to MetaMask
      await addTokenToMetaMask(customTokenAddress, symbol, Number(decimals));
    } catch (err: any) {
      console.error("Error adding custom token:", err);
      setError(err.message || "Failed to add token");
    } finally {
      setLoading(false);
    }
  };

  const removeToken = (tokenAddress: string) => {
    const updatedBalances = balances.filter(
      (t) => t.address.toLowerCase() !== tokenAddress.toLowerCase()
    );
    setBalances(updatedBalances);
    saveCustomTokens(updatedBalances);
  };

  const refreshBalances = async () => {
    if (provider && address) {
      try {
        setRefreshing(true);
        await fetchBalances(provider, address);
      } finally {
        setTimeout(() => setRefreshing(false), 1000);
      }
    }
  };

  useEffect(() => {
    const checkConnectedWallet = async () => {
      if (window.ethereum?.selectedAddress) {
        await connectWallet();
      }
    };

    checkConnectedWallet();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAddress("");
        setBalances([]);
      } else if (address !== accounts[0]) {
        connectWallet();
      }
    };

    window.ethereum?.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  return (
    <div className="space-y-4">
      {!address ? (
        <Button
          onClick={connectWallet}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Connecting..." : "Connect MetaMask (Sepolia)"}
        </Button>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Wallet Address Column */}
          <Card className="flex-1 bg-white/5 border border-white/20 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/80">
                Wallet Address
              </CardTitle>
              <Wallet className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-white font-mono text-sm break-all">
                {address}
              </div>
              <div className="text-green-400 text-xs">
                Connected to Sepolia testnet
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <label className="text-sm text-white/80">
                    Add Custom Token
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={customTokenAddress}
                      onChange={(e) => setCustomTokenAddress(e.target.value)}
                      placeholder="0x..."
                      className="bg-white/10 border-white/20 text-white flex-1"
                    />
                    <Button
                      onClick={addCustomToken}
                      disabled={loading || !customTokenAddress}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? "Adding..." : "Add"}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-red-400 text-sm mt-2">{error}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Balances Column */}
          <Card className="flex-1 bg-white/5 border border-white/20 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-white/80">
                  Token Balances
                </CardTitle>
                <Button
                  onClick={refreshBalances}
                  size="sm"
                  variant="ghost"
                  className="text-white/60 hover:to-blue-400"
                  disabled={refreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
              <Coins className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              {loading && balances.length === 0 ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse h-8 bg-white/20 rounded"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {balances.map((token) => (
                    <div
                      key={`${token.address}-${token.symbol}`}
                      className="group flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {token.symbol}
                        </span>
                        {token.isNative ? (
                          <span className="text-xs text-green-400">
                            (Native)
                          </span>
                        ) : (
                          <span className="text-xs text-blue-400">
                            (Custom)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono">
                          {parseFloat(token.formattedBalance).toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 6,
                            }
                          )}
                        </span>
                        {!token.isNative && (
                          <button
                            onClick={() => removeToken(token.address)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity"
                            title="Remove token"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
