import { useState, useEffect } from "react";
import { Visit, visitService } from "@/services/visitService";
import { PatientProfile } from "@/types/patient";
import { useToast } from "@/hooks/use-toast";

export function useVisitManagement(patient: PatientProfile) {
  const { toast } = useToast();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  useEffect(() => {
    loadVisits();
  }, [patient.id]);

  const loadVisits = async () => {
    try {
      setLoading(true);
      const data = await visitService.getVisitsByPatient(patient.id);
      setVisits(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load visits: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVisit = async (visitData: any) => {
    try {
      await visitService.createVisit({
        ...visitData,
        patient_id: patient.id,
      });
      
      setIsCreateDialogOpen(false);
      loadVisits();
      
      toast({
        title: "Success",
        description: "Visit created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create visit: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditVisit = (visit: Visit) => {
    setSelectedVisit(visit);
    setIsEditDialogOpen(true);
  };

  const handleUpdateVisit = async (visitData: any) => {
    if (!selectedVisit) return;
    
    try {
      await visitService.updateVisit(selectedVisit.id, visitData);
      setIsEditDialogOpen(false);
      setSelectedVisit(null);
      loadVisits();
      
      toast({
        title: "Success",
        description: "Visit updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update visit: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteVisit = async (visitId: string) => {
    if (!confirm("Are you sure you want to delete this visit?")) return;
    
    try {
      await visitService.deleteVisit(visitId);
      loadVisits();
      
      toast({
        title: "Success",
        description: "Visit deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete visit: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedVisit(null);
  };

  return {
    visits,
    loading,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedVisit,
    setIsCreateDialogOpen,
    handleCreateVisit,
    handleEditVisit,
    handleUpdateVisit,
    handleDeleteVisit,
    handleCreateDialogClose,
    handleEditDialogClose,
  };
}