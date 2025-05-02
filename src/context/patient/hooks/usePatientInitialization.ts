
import { useState, useEffect } from "react";
import { PatientProfile } from "@/types/patient";
import { useToast } from "@/components/ui/use-toast";
import { patientStorage } from "../patient-storage";

export function usePatientInitialization() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initial data fetch from database
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // First attempt to fetch from database
        const dbPatients = await patientStorage.refreshFromDatabase();
        setPatients(dbPatients);
        
        // Then save to localStorage as backup
        localStorage.setItem("patients", JSON.stringify(dbPatients));
      } catch (error: any) {
        console.error("Error initializing patients data:", error);
        setError(error.message || "Failed to load patients");
        
        // Try to load from localStorage as fallback
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
            toast({
              title: "Warning",
              description: "Using cached patient data. Some information may be outdated.",
              variant: "destructive",
            });
          } catch (parseError) {
            console.error("Failed to parse saved patients:", parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();
  }, [toast]);

  return { patients, setPatients, loading, setLoading, error, setError };
}
