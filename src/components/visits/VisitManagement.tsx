
import { useState, useEffect } from "react";
import { Visit, visitService } from "@/services/visitService";
import { PatientProfile } from "@/types/patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Calendar, DollarSign, FileText, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/superbill-utils";
import { VisitForm } from "./VisitForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface VisitManagementProps {
  patient: PatientProfile;
}

export function VisitManagement({ patient }: VisitManagementProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unbilled": return "bg-yellow-100 text-yellow-800";
      case "billed": return "bg-green-100 text-green-800";
      case "included_in_superbill": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading visits...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Patient Visits</h3>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Visit
        </Button>
      </div>

      {visits.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium mb-2">No visits recorded</h4>
            <p className="text-muted-foreground mb-4">
              Add visits for {patient.name} to track their care history.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Visit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {visits.map((visit) => (
            <Card key={visit.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatDate(new Date(visit.visit_date))}
                        </span>
                      </div>
                      <Badge className={getStatusColor(visit.status || "unbilled")}>
                        {visit.status?.replace("_", " ") || "unbilled"}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>${(visit.fee || 0).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      {visit.icd_codes && Array.isArray(visit.icd_codes) && visit.icd_codes.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">ICD:</span> {visit.icd_codes.join(", ")}
                        </div>
                      )}
                      {visit.cpt_codes && Array.isArray(visit.cpt_codes) && visit.cpt_codes.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">CPT:</span> {visit.cpt_codes.join(", ")}
                        </div>
                      )}
                      {visit.main_complaints && Array.isArray(visit.main_complaints) && visit.main_complaints.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Complaints:</span> {visit.main_complaints.join(", ")}
                        </div>
                      )}
                      {visit.notes && (
                        <div>
                          <span className="text-muted-foreground">Notes:</span> {visit.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditVisit(visit)}
                      disabled={visit.status === "billed"}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVisit(visit.id)}
                      disabled={visit.status === "billed"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Visit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Visit for {patient.name}</DialogTitle>
          </DialogHeader>
          <VisitForm
            onSubmit={handleCreateVisit}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Visit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Visit</DialogTitle>
          </DialogHeader>
          <VisitForm
            visit={selectedVisit}
            onSubmit={handleUpdateVisit}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedVisit(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
