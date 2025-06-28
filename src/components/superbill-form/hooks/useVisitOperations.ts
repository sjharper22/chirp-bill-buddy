
import { Visit } from "@/types/superbill";
import { generateId } from "@/lib/utils/superbill-utils";
import { CptCodeEntry } from "@/types/cpt-entry";

export function useVisitOperations(
  superbill: any,
  setSuperbill: (updater: (prev: any) => any) => void
) {
  const updateVisit = (updatedVisit: Visit) => {
    setSuperbill(prev => ({
      ...prev,
      visits: prev.visits.map((visit: Visit) => 
        visit.id === updatedVisit.id ? updatedVisit : visit
      )
    }));
  };

  const addVisit = () => {
    const now = new Date();
    const newVisit: Visit = {
      id: generateId(),
      date: now,
      icdCodes: [...superbill.defaultIcdCodes],
      cptCodes: [...superbill.defaultCptCodes], // Keep for backward compatibility
      cptCodeEntries: [], // Start with empty itemized codes
      fee: superbill.defaultFee,
      mainComplaints: [...superbill.defaultMainComplaints],
      status: 'draft',
      notes: ""
    };

    setSuperbill(prev => ({
      ...prev,
      visits: [...prev.visits, newVisit]
    }));
  };

  const duplicateVisit = (visit: Visit) => {
    const duplicatedVisit: Visit = {
      ...visit,
      id: generateId(),
      cptCodeEntries: visit.cptCodeEntries ? [...visit.cptCodeEntries] : []
    };

    setSuperbill(prev => ({
      ...prev,
      visits: [...prev.visits, duplicatedVisit]
    }));
  };

  const deleteVisit = (id: string) => {
    setSuperbill(prev => ({
      ...prev,
      visits: prev.visits.filter((visit: Visit) => visit.id !== id)
    }));
  };

  const updateVisitsWithDefaults = () => {
    setSuperbill(prev => ({
      ...prev,
      visits: prev.visits.map((visit: Visit) => ({
        ...visit,
        icdCodes: [...superbill.defaultIcdCodes],
        cptCodes: [...superbill.defaultCptCodes], // Keep for backward compatibility
        mainComplaints: [...superbill.defaultMainComplaints],
        fee: superbill.defaultFee
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
