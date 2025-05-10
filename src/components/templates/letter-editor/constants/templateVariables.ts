
import { TemplateVariable } from '@/types/template';

// Template variables that can be inserted
export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  // Patient Information
  { label: 'Patient Name', variable: 'patient.name', group: 'Patient' },
  { label: 'Patient First Name', variable: 'patient.firstName', group: 'Patient' },
  { label: 'Patient Last Name', variable: 'patient.lastName', group: 'Patient' },
  { label: 'Date of Birth', variable: 'patient.dob', group: 'Patient' },
  { label: 'Patient Address', variable: 'patient.address', group: 'Patient' },
  { label: 'Patient Phone', variable: 'patient.phone', group: 'Patient' },
  { label: 'Patient Email', variable: 'patient.email', group: 'Patient' },
  
  // Visit Information
  { label: 'Visit Period', variable: 'superbill.visitDateRange', group: 'Visits' },
  { label: 'Earliest Visit', variable: 'superbill.earliestDate', group: 'Visits' },
  { label: 'Latest Visit', variable: 'superbill.latestDate', group: 'Visits' },
  { label: 'Total Visits', variable: 'superbill.totalVisits', group: 'Visits' },
  { label: 'Visit Dates List', variable: 'superbill.visitDates', group: 'Visits' },
  
  // Billing Information
  { label: 'Total Charges', variable: 'superbill.totalFee', group: 'Billing' },
  { label: 'Issue Date', variable: 'superbill.issueDate', group: 'Billing' },
  
  // Clinic Information
  { label: 'Clinic Name', variable: 'clinic.name', group: 'Clinic' },
  { label: 'Provider Name', variable: 'clinic.provider', group: 'Clinic' },
  { label: 'NPI Number', variable: 'clinic.npi', group: 'Clinic' },
  { label: 'EIN Number', variable: 'clinic.ein', group: 'Clinic' },
  { label: 'Clinic Address', variable: 'clinic.address', group: 'Clinic' },
  { label: 'Clinic Phone', variable: 'clinic.phone', group: 'Clinic' },
  { label: 'Clinic Email', variable: 'clinic.email', group: 'Clinic' },
  
  // Dates
  { label: 'Today\'s Date', variable: 'dates.today', group: 'Dates' },
  { label: 'Current Month', variable: 'dates.currentMonth', group: 'Dates' },
  { label: 'Current Year', variable: 'dates.currentYear', group: 'Dates' },
];
