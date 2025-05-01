
import { format } from "date-fns";

/**
 * Formats a date for display
 */
export const formatDate = (date: Date): string => {
  if (!date) return '';
  return format(new Date(date), "MM/dd/yyyy");
};

/**
 * Formats a currency amount for display
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

/**
 * Formats status for display
 */
export const formatStatus = (status: string): string => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};
