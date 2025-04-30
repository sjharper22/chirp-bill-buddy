
import { Superbill } from "@/types/superbill";
import { format } from "date-fns";

/**
 * Interface for variable mapping context with patient, superbill and other data
 */
export interface VariableContext {
  patient?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    salutation_name?: string;
    dob?: Date;
    [key: string]: any;
  };
  superbill?: {
    issueDate?: Date;
    visits?: Array<any>;
    totalFee?: number;
    [key: string]: any;
  };
  clinic?: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    provider?: string;
    [key: string]: any;
  };
  dates?: {
    today?: Date;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Process a template by replacing variables in double curly brackets {{}}
 * with corresponding values from the provided context
 */
export function processTemplate(template: string, context: VariableContext): string {
  if (!template) return '';

  // Process today date variable
  const today = new Date();
  if (!context.dates) context.dates = {};
  context.dates.today = today;
  
  // Process total charge if superbill is provided
  if (context.superbill?.visits) {
    context.superbill.totalFee = context.superbill.visits.reduce(
      (sum: number, visit: any) => sum + (visit.fee || 0), 
      0
    );
  }

  // Regular expression to match variables like {{patient.name}} or {{today}}
  const variablePattern = /\{\{([^}]+)\}\}/g;

  return template.replace(variablePattern, (match, path) => {
    const pathParts = path.trim().split('.');
    let value: any = context;

    // Navigate through the nested properties
    for (const part of pathParts) {
      if (value === undefined || value === null) {
        return match; // Return the original placeholder if the path is invalid
      }
      value = value[part];
    }

    // Format special values
    if (value instanceof Date) {
      if (pathParts[0] === 'dates' && pathParts[1] === 'today') {
        return format(value, 'MMMM d, yyyy');
      }
      return format(value, 'MM/dd/yyyy');
    }
    
    if (typeof value === 'number') {
      // Format as currency if likely a monetary value
      if (pathParts.includes('totalFee') || 
          pathParts.includes('fee') || 
          path.toLowerCase().includes('charge') || 
          path.toLowerCase().includes('cost')) {
        return `$${value.toFixed(2)}`;
      }
      return String(value);
    }

    // Return the value if it exists, otherwise return the original placeholder
    return value !== undefined && value !== null ? String(value) : match;
  });
}

/**
 * Creates a context object from a superbill for template processing
 */
export function createContextFromSuperbill(superbill: Superbill): VariableContext {
  // Get the earliest and latest visit dates
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 
    ? new Date(Math.min(...visitDates))
    : new Date();
  const latestDate = visitDates.length > 0 
    ? new Date(Math.max(...visitDates))
    : new Date();

  // Split the patient name into first and last names
  const nameParts = superbill.patientName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  return {
    patient: {
      name: superbill.patientName,
      firstName: firstName,
      lastName: lastName,
      salutation_name: firstName,
      dob: superbill.patientDob,
    },
    superbill: {
      issueDate: superbill.issueDate,
      visits: superbill.visits,
      totalFee: superbill.visits.reduce((sum, visit) => sum + (visit.fee || 0), 0),
      visitDates: superbill.visits.map(visit => visit.date),
      earliestDate: earliestDate,
      latestDate: latestDate,
    },
    clinic: {
      name: superbill.clinicName,
      address: superbill.clinicAddress,
      phone: superbill.clinicPhone,
      email: superbill.clinicEmail,
      provider: superbill.providerName,
      ein: superbill.ein,
      npi: superbill.npi
    },
    dates: {
      today: new Date(),
    }
  };
}
