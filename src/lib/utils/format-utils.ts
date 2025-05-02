
import { SuperbillStatus } from "@/types/superbill";

// Format date to MM/DD/YYYY
export function formatDate(date: Date): string {
  if (!date) return "N/A";
  
  try {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

// Format currency to USD
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

// Format status string for display
export function formatStatus(status: SuperbillStatus | string): string {
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
      return status;
  }
}
