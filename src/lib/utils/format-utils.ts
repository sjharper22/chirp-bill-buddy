
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
    case "Complete":
      return "Complete";
    case "Missing Info":
      return "Missing Info";
    case "Draft":
      return "Draft";
    case "No Superbill":
      return "No Superbill";
    default:
      return status;
  }
}

// Convert status to consistent format for comparison
export function normalizeStatus(status: SuperbillStatus | string): string {
  // Convert to lowercase for consistent comparison
  const lowercaseStatus = status.toLowerCase();
  
  // Map similar statuses to a standard form
  if (lowercaseStatus === 'complete') return 'completed';
  if (lowercaseStatus === 'draft') return 'draft';
  if (lowercaseStatus === 'missing info') return 'in_progress';
  
  return lowercaseStatus;
}
