"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { UserRoundPen } from "lucide-react";

interface ChangeOwnerFormProps {
  onSubmit: (newOwnerAddress: string) => Promise<void>;
  loading: boolean;
  error: string;
}

export const ChangeOwnerForm = ({
  onSubmit,
  loading,
  error,
}: ChangeOwnerFormProps) => {
  const [newOwnerAddress, setNewOwnerAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newOwnerAddress);

    setNewOwnerAddress("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-teal-400/20 rounded-xl p-6 border border-teal-600 "
    >
      <h3 className="text-white text-2xl font-bold flex gap-3">
        <UserRoundPen className="text-green-400"/>
        Change Contract Owner
      </h3>
      <div className="space-y-2">
        <Label htmlFor="newOwner" className="text-white/80">
          New Owner Address
        </Label>
        <Input
          id="newOwner"
          placeholder="0x..."
          value={newOwnerAddress}
          onChange={(e) => setNewOwnerAddress(e.target.value)}
          className="bg-white/5 border-white/20 text-white"
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={loading || !newOwnerAddress}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
      >
        {loading ? "Processing..." : "Transfer Ownership"}
      </Button>
    </form>
  );
};
