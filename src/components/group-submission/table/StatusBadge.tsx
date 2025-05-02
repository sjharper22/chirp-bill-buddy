
import { Badge } from "@/components/ui/badge";
import { SuperbillStatus } from "@/types/superbill";

export type StatusDisplayType = "Complete" | "Missing Info" | "Draft" | "No Superbill";

export interface StatusBadgeProps {
  status: StatusDisplayType | SuperbillStatus | string;
  variant?: "default" | "success" | "warning" | "info" | "error";
  className?: string;
}

// Function to map superbill status to appropriate variant
export function mapStatusToVariant(status: StatusDisplayType | SuperbillStatus | string): "default" | "success" | "warning" | "info" | "error" {
  // Normalize the status by converting to lowercase for comparison
  const normalizedStatus = status.toLowerCase();
  
  // Check for status patterns
  if (normalizedStatus.includes('complet') || normalizedStatus === 'complete') {
    return "success";
  } else if (normalizedStatus.includes('progress') || normalizedStatus.includes('review') || normalizedStatus === 'missing info') {
    return "warning";
  } else if (normalizedStatus.includes('draft')) {
    return "info";
  } else if (normalizedStatus.includes('no')) {
    return "error";
  }
  
  // Default fallback based on exact status values
  switch (status) {
    case "Complete":
    case "completed":
      return "success";
    case "Missing Info":
    case "in_progress":
    case "in_review":
      return "warning";
    case "Draft":
    case "draft":
      return "info";
    case "No Superbill":
      return "error";
    default:
      return "default";
  }
}

// Function to map status to consistent display string
export function formatStatusDisplay(status: StatusDisplayType | SuperbillStatus | string): string {
  // Check for exact matches with case sensitivity preserved for display
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "in_review":
      return "In Review";
    case "completed":
      return "Completed";
    case "draft":
      return "Draft";
    case "Complete":
      return "Complete";
    case "Missing Info":
      return "Missing Info";
    case "Draft":
      return "Draft";
    case "No Superbill":
      return "No Superbill";
    default:
      return status.toString();
  }
}

export function StatusBadge({ status, variant, className = "" }: StatusBadgeProps) {
  // If variant is not provided, determine it based on status
  const badgeVariant = variant || mapStatusToVariant(status);

  // Convert BadgeVariant to a type that Badge component accepts
  const convertedVariant = badgeVariant === "success" ? "default" :
                         badgeVariant === "warning" ? "secondary" :
                         badgeVariant === "info" ? "outline" :
                         badgeVariant === "error" ? "destructive" : "default";
  
  // Format the display text
  const displayText = formatStatusDisplay(status);
  
  return (
    <Badge variant={convertedVariant} className={`${className} ${getStatusColorClass(badgeVariant)}`}>
      {displayText}
    </Badge>
  );
}

// Helper function to apply color classes based on status variant
function getStatusColorClass(variant: "default" | "success" | "warning" | "info" | "error"): string {
  switch (variant) {
    case "success":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "warning":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "info":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "error":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "";
  }
}
