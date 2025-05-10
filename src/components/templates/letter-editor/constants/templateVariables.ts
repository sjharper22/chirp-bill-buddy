
import { TemplateVariable } from '@/types/template';

// Template variables that can be inserted
export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  { label: 'Patient Name', variable: 'patient.name', group: 'Patient' },
  { label: 'Patient First Name', variable: 'patient.firstName', group: 'Patient' },
  { label: 'Date of Birth', variable: 'patient.dob', group: 'Patient' },
  { label: 'Visit Period', variable: 'superbill.visitDateRange', group: 'Visits' },
  { label: 'Total Visits', variable: 'superbill.totalVisits', group: 'Visits' },
  { label: 'Total Charges', variable: 'superbill.totalFee', group: 'Billing' },
  { label: 'Clinic Name', variable: 'clinic.name', group: 'Clinic' },
  { label: 'Provider Name', variable: 'clinic.provider', group: 'Clinic' },
  { label: 'NPI Number', variable: 'clinic.npi', group: 'Clinic' },
  { label: 'EIN Number', variable: 'clinic.ein', group: 'Clinic' },
  { label: 'Clinic Address', variable: 'clinic.address', group: 'Clinic' },
  { label: 'Clinic Phone', variable: 'clinic.phone', group: 'Clinic' },
  { label: 'Today\'s Date', variable: 'dates.today', group: 'Dates' },
];
