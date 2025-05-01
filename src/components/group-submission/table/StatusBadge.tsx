
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'error';
  className?: string;
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  // If variant is provided, use it to determine the style
  if (variant) {
    switch (variant) {
      case 'success':
        return <Badge className={`bg-green-100 text-green-800 hover:bg-green-200 ${className || ""}`}>{status}</Badge>;
      case 'warning':
        return <Badge className={`bg-amber-100 text-amber-800 hover:bg-amber-200 ${className || ""}`}>{status}</Badge>;
      case 'info':
        return <Badge className={`bg-blue-100 text-blue-800 hover:bg-blue-200 ${className || ""}`}>{status}</Badge>;
      case 'error':
        return <Badge className={`bg-red-100 text-red-800 hover:bg-red-200 ${className || ""}`}>{status}</Badge>;
      default:
        return <Badge className={`bg-gray-100 text-gray-800 hover:bg-gray-200 ${className || ""}`}>{status}</Badge>;
    }
  }

  // Default behavior based on status string
  switch (status.toLowerCase()) {
    case "complete":
    case "completed":
    case "active":
    case "approved":
      return <Badge className={`bg-green-100 text-green-800 hover:bg-green-200 ${className || ""}`}>{status}</Badge>;
    case "missing info":
    case "pending":
    case "in review":
    case "in progress":
      return <Badge className={`bg-amber-100 text-amber-800 hover:bg-amber-200 ${className || ""}`}>{status}</Badge>;
    case "draft":
    case "new":
      return <Badge className={`bg-blue-100 text-blue-800 hover:bg-blue-200 ${className || ""}`}>{status}</Badge>;
    case "no superbill":
    case "error":
    case "rejected":
      return <Badge className={`bg-red-100 text-red-800 hover:bg-red-200 ${className || ""}`}>{status}</Badge>;
    default:
      return <Badge className={`bg-gray-100 text-gray-800 hover:bg-gray-200 ${className || ""}`}>{status}</Badge>;
  }
}
