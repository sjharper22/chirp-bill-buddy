
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PatientProfile } from "@/types/patient";
import { generateId } from "@/lib/utils/superbill-utils";

interface PatientContextType {
  patients: PatientProfile[];
  addPatient: (patient: Omit<PatientProfile, "id">) => PatientProfile;
  updatePatient: (id: string, patient: PatientProfile) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => PatientProfile | undefined;
  selectedPatientIds: string[];
  togglePatientSelection: (id: string) => void;
  selectAllPatients: () => void;
  clearPatientSelection: () => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedPatients = localStorage.getItem("patients");

    if (savedPatients) {
      try {
        // Convert string dates back to Date objects
        const parsed = JSON.parse(savedPatients, (key, value) => {
          if (key === "dob" || key === "lastSuperbillDate" || key === "start" || key === "end") {
            return value ? new Date(value) : value;
          }
          return value;
        });
        setPatients(parsed);
      } catch (error) {
        console.error("Failed to parse saved patients:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  const addPatient = (patient: Omit<PatientProfile, "id">) => {
    const newPatient = { ...patient, id: generateId() };
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (id: string, updatedPatient: PatientProfile) => {
    setPatients(prev => prev.map(patient => patient.id === id ? updatedPatient : patient));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
    setSelectedPatientIds(prev => prev.filter(patientId => patientId !== id));
  };

  const getPatient = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  const togglePatientSelection = (id: string) => {
    setSelectedPatientIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(patientId => patientId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const selectAllPatients = () => {
    setSelectedPatientIds(patients.map(patient => patient.id));
  };

  const clearPatientSelection = () => {
    setSelectedPatientIds([]);
  };

  return (
    <PatientContext.Provider 
      value={{ 
        patients, 
        addPatient, 
        updatePatient, 
        deletePatient, 
        getPatient,
        selectedPatientIds,
        togglePatientSelection,
        selectAllPatients,
        clearPatientSelection
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
}
