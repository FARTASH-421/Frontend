"use client";

import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../lib/contract-abi";

export const useWallet = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<ethers.Network | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nativeBalance, setNativeBalance] = useState<string>("0");
  const [tokenBalance, setTokenBalance] = useState<string>("0");

  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setIsOwner(false);
    setNativeBalance("0");
    setTokenBalance("0");
    toast.success("Wallet disconnected.");
  }, []);

  const fetchBalances = useCallback(async () => {
    if (!provider || !account || !contract) return;

    try {
      // Fetch native balance (ETH)
      const balance = await provider.getBalance(account);
      setNativeBalance(ethers.formatEther(balance));

      // Fetch token balance from your contract
      // Assuming your contract has a balanceOf function
      const tokenBal = await contract.balanceOf(account);
      setTokenBalance(ethers.formatEther(tokenBal)); // Adjust decimals if needed
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  }, [provider, account, contract]);

  const connectWallet = useCallback(async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        setLoading(true);
        await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        const ethProvider = new ethers.BrowserProvider(
          (window as any).ethereum
        );
        const ethSigner = await ethProvider.getSigner();
        const address = await ethSigner.getAddress();

        const currentNetwork = await ethProvider.getNetwork();
        if (currentNetwork.chainId !== BigInt(11155111)) {
          toast.error("Please switch to Sepolia testnet!");
          setLoading(false);
          return;
        }

        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          ethSigner
        );

        const ownerAddress = await contractInstance.owner();

        setProvider(ethProvider);
        setSigner(ethSigner);
        setContract(contractInstance);
        setAccount(address);
        setNetwork(currentNetwork);
        setIsOwner(address.toLowerCase() === ownerAddress.toLowerCase());

        // Fetch balances after connection
        await fetchBalances();

        toast.success("Wallet connected successfully!");
        return contractInstance;
      } catch (error: any) {
        console.error("Error connecting wallet:", error);
        toast.error(
          error.code === 4001
            ? "Connection rejected by user."
            : "Failed to connect wallet."
        );
        disconnectWallet();
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please install MetaMask to use this dApp!");
      setLoading(false);
    }
  }, [disconnectWallet, fetchBalances]);

  // Add event listeners for balance changes
  useEffect(() => {
    if (!provider || !account) return;

    const updateBalances = () => {
      fetchBalances();
    };

    // Listen for account changes
    (window as any).ethereum.on("accountsChanged", updateBalances);

    // Listen for chain changes
    (window as any).ethereum.on("chainChanged", updateBalances);

    return () => {
      if ((window as any).ethereum.removeListener) {
        (window as any).ethereum.removeListener(
          "accountsChanged",
          updateBalances
        );
        (window as any).ethereum.removeListener("chainChanged", updateBalances);
      }
    };
  }, [provider, account, fetchBalances]);

  return {
    provider,
    signer,
    contract,
    account,
    network,
    isOwner,
    loading,
    nativeBalance,
    tokenBalance,
    connectWallet,
    disconnectWallet,
    fetchBalances, // Optional: expose if you want to manually trigger balance updates
  };
};
