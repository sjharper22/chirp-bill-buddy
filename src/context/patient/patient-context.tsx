
import { createContext, useContext } from "react";
import { PatientContextType } from "./types";
import { PatientProvider as Provider } from "./patient-provider";

// Create context with undefined default value
export const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Export the provider component
export const PatientProvider = Provider;

// Hook to use the patient context
export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
}
