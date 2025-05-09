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
