import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function SetPriceFreshnessLimit({ contract, refresh }) {
  const [seconds, setSeconds] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetLimit = async () => {
    if (!seconds || isNaN(seconds) || Number(seconds) <= 0) {
      toast.error("Please enter a positive number of seconds", {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        },
      });
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating freshness limit...", {
      icon: <Loader2 className="h-5 w-5 animate-spin text-blue-500" />,
      style: {
        background: "#1f2937",
        color: "#fff",
      },
    });

    try {
      const tx = await contract.setPriceFreshnessLimit(Number(seconds));
      await tx.wait();

      toast.success(`Set to ${seconds} seconds`, {
        id: toastId,
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        },
      });

      refresh?.();
    } catch (err) {
      toast.error(err.message || "Transaction failed", {
        id: toastId,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900/30 border border-gray-700 rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Clock className="h-5 w-5 text-blue-400" />
          Price Freshness Limit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="seconds" className="text-gray-300">
            Maximum Age (Seconds)
          </Label>
          <div className="relative">
            <Input
              id="seconds"
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              placeholder="300"
              disabled={loading}
              className="bg-gray-800 border-gray-700 text-white pl-9"
              min="1"
            />
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Button
          onClick={handleSetLimit}
          disabled={loading}
          className="w-full bg-orange-800 hover:bg-orange-600 text-white transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Set Limit
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
