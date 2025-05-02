
import { Badge } from "@/components/ui/badge";
import { SuperbillStatus } from "@/types/superbill";

type StatusDisplayType = "Complete" | "Missing Info" | "Draft" | "No Superbill";

interface StatusBadgeProps {
  status: StatusDisplayType | SuperbillStatus;
  variant?: "default" | "success" | "warning" | "info" | "error";
  className?: string;
}

// Function to map superbill status to appropriate variant
export function mapStatusToVariant(status: StatusDisplayType | SuperbillStatus): "default" | "success" | "warning" | "info" | "error" {
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

// Function to map status to display string
export function formatStatusDisplay(status: StatusDisplayType | SuperbillStatus): string {
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "in_review":
      return "In Review";
    case "completed":
      return "Completed";
    case "draft":
      return "Draft";
    default:
      return status.toString();
  }
}

export function StatusBadge({ status, variant, className = "" }: StatusBadgeProps) {
  // If variant is not provided, determine it based on status
  const badgeVariant = variant || mapStatusToVariant(status);
  
  // Format the display text
  const displayText = formatStatusDisplay(status);
  
  return (
    <Badge variant={badgeVariant} className={className}>
      {displayText}
    </Badge>
  );
}
