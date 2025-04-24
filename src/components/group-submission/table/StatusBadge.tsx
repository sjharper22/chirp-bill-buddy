
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "Complete":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
    case "Missing Info":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">{status}</Badge>;
    case "Draft":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{status}</Badge>;
    case "No Superbill":
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
  }
}
