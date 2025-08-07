import { Copy, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";

interface AddressDisplayProps {
  address: string;
  length?: number;
  showCopy?: boolean;
  showLink?: boolean;
  className?: string;
}

export const AddressDisplay = ({
  address,
  length = 6,
  showCopy = true,
  showLink = true,
  className = "",
}: AddressDisplayProps) => {
  if (!address || address === "0x")
    return <span className={className}>N/A</span>;

  const formattedAddress = `${address.slice(0, length)}...${address.slice(
    -length
  )}`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-mono text-xl">{formattedAddress}</span>
      {showCopy && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            navigator.clipboard.writeText(address);
            toast.success("Address copied!");
          }}
          className="h-6 w-6"
        >
          <Copy className="h-3 w-3" />
        </Button>
      )}
      {showLink && (
        <a
          href={`https://sepolia.etherscan.io/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
};
