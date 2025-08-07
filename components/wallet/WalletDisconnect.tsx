import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Copy, Wallet } from "lucide-react";
import { AddressDisplay } from "../common/AddressDisplay";
import { toast } from "react-hot-toast";

interface WalletDisconnectProps {
  account: string;
  isOwner: boolean;
  onDisconnect: () => void;
}

export const WalletDisconnect = ({
  account,
  isOwner,
  onDisconnect,
}: WalletDisconnectProps) => (
  <Card className="max-w-4xl mx-auto mb-8 bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
    <CardHeader>
      <CardTitle className="text-white text-center">
        Wallet Connection
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center relative">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Wallet className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Connected Wallet
        </h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <AddressDisplay address={account} showLink={false} />
        </div>
        <div className="flex justify-around items-center">
          {isOwner && (
            <span className="inline-block absolute top-[-60px] left-[-15px] bg-gradient-to-r from-yellow-800 to-orange-600 text-black px-6 py-3 rounded-2xl text-sm font-semibold">
              Contract Owner
            </span>
          )}
          <Button onClick={onDisconnect} variant="destructive" className="mt-4 hover:bg-pink-500 hover:cursor-pointer px-10">
            Disconnect Wallet
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
