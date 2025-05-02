
import { Visit, Superbill } from "@/types/superbill";
import { createEmptyVisit, generateId } from "@/lib/utils/superbill-utils";
import { ReactStateUpdater } from "./types";

/**
 * Hook for managing visit operations within a superbill
 */
export function useVisitOperations(
  superbill: Omit<Superbill, "id" | "createdAt" | "updatedAt">, 
  setSuperbill: ReactStateUpdater<Omit<Superbill, "id" | "createdAt" | "updatedAt">>
) {
  // Visit Operations
  const updateVisit = (updatedVisit: Visit) => {
    setSuperbill(prev => ({
      ...prev,
      visits: prev.visits.map(visit => 
        visit.id === updatedVisit.id ? updatedVisit : visit
      )
    }));
  };
  
  const addVisit = () => {
    const newVisit = createEmptyVisit(
      superbill.defaultIcdCodes,
      superbill.defaultCptCodes,
      superbill.defaultFee
    );
    
    // If there are default main complaints, use the first one
    if (superbill.defaultMainComplaints && superbill.defaultMainComplaints.length > 0) {
      newVisit.mainComplaints = [superbill.defaultMainComplaints[0]];
    }
    
    setSuperbill(prev => ({
      ...prev,
      visits: [...prev.visits, newVisit]
    }));
  };
  
  const duplicateVisit = (visit: Visit) => {
    setSuperbill(prev => ({
      ...prev,
      visits: [...prev.visits, { ...visit, id: generateId() }]
    }));
  };
  
  const deleteVisit = (id: string) => {
    setSuperbill(prev => ({
      ...prev,
      visits: prev.visits.filter(visit => visit.id !== id)
    }));
  };
  
  const updateVisitsWithDefaults = () => {
    if (superbill.visits.length === 0) return;
    
    if (!confirm("Update all existing visits with these default values?")) {
      return;
    }
    
    setSuperbill(prev => ({
      ...prev,
      visits: prev.visits.map(visit => ({
        ...visit,
        icdCodes: [...prev.defaultIcdCodes],
        cptCodes: [...prev.defaultCptCodes],
        // Don't update mainComplaint automatically
        fee: prev.defaultFee
      }))
    }));
  };

  return {
    updateVisit,
    addVisit,
    duplicateVisit,
    deleteVisit,
    updateVisitsWithDefaults
  };
}
