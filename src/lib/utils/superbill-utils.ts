
// This file now re-exports all utility functions from the separate files
// to maintain backward compatibility and avoid breaking existing imports

export { generateId } from './id-utils';
export { formatDate, formatCurrency, formatStatus } from './format-utils';
export { calculateTotalFee } from './financial-utils';
export { createEmptyVisit, duplicateVisit, getStatusVariant } from './visit-utils';
export { filterSuperbills, sortSuperbillsByDate } from './superbill-filter-utils';
export { commonICD10Codes, commonCPTCodes } from './medical-codes';
