
// Function to determine badge variant based on status
export function getStatusVariant(status: string): "default" | "info" | "success" | "warning" | "error" {
  // Normalize status for consistent checks
  const normalizedStatus = status.toLowerCase();
  
  // Map status to variant
  if (normalizedStatus.includes('complet') || normalizedStatus === 'done') {
    return 'success';
  }
  
  if (normalizedStatus.includes('review')) {
    return 'info';
  }
  
  if (normalizedStatus.includes('progress') || normalizedStatus.includes('pending')) {
    return 'warning';
  }
  
  if (normalizedStatus.includes('error') || normalizedStatus.includes('fail')) {
    return 'error';
  }
  
  // Default for draft and other statuses
  return 'default';
}

// Function to format status for display
export function statusToDisplay(status: string): string {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Function to create an empty visit
import { Visit } from '@/types/superbill';
import { generateId } from './id-utils';

export function createEmptyVisit(): Visit {
  return {
    id: generateId(),
    date: new Date(),
    icdCodes: [],
    cptCodes: [],
    fee: 0,
    notes: '',
    mainComplaints: []
  };
}

// Function to duplicate a visit
export function duplicateVisit(visit: Visit): Visit {
  return {
    ...visit,
    id: generateId()
  };
}
