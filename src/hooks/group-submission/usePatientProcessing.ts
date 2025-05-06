
import { useState, useEffect } from "react";
import { usePatient } from "@/context/patient-context";
import { useSuperbill } from "@/context/superbill-context";
import { PatientWithSuperbills } from "@/components/group-submission/types";
import { determineStatus } from "./useStatusDetermination";

export function usePatientProcessing() {
  const { patients } = usePatient();
  const { superbills } = useSuperbill();
  
  const [patientsWithSuperbills, setPatientsWithSuperbills] = useState<PatientWithSuperbills[]>([]);
  
  // Process patients and their superbills
  useEffect(() => {
    const processed: PatientWithSuperbills[] = patients.map(patient => {
      // Find superbills for this patient
      const patientSuperbills = superbills.filter(bill => bill.patientName === patient.name);
      
      // Calculate total visits and amount
      const totalVisits = patientSuperbills.reduce((total, bill) => total + bill.visits.length, 0);
      const totalAmount = patientSuperbills.reduce((total, bill) => {
        return total + bill.visits.reduce((subtotal, visit) => subtotal + visit.fee, 0);
      }, 0);
      
      // Determine date range across all visits
      let earliestDate: Date | null = null;
      let latestDate: Date | null = null;
      
      patientSuperbills.forEach(bill => {
        bill.visits.forEach(visit => {
          const visitDate = new Date(visit.date);
          if (!earliestDate || visitDate < earliestDate) {
            earliestDate = visitDate;
          }
          if (!latestDate || visitDate > latestDate) {
            latestDate = visitDate;
          }
        });
      });
      
      // Set date range if we found valid dates
      const dateRange = (earliestDate && latestDate)
        ? { start: earliestDate, end: latestDate }
        : null;
      
      // Calculate the status with our helper function
      const status = determineStatus(patientSuperbills);
      
      return {
        ...patient,
        superbills: patientSuperbills,
        totalVisits,
        totalAmount,
        status,
        dateRange
      };
    });
    
    setPatientsWithSuperbills(processed);
  }, [patients, superbills]);
  
  return { patientsWithSuperbills };
}
