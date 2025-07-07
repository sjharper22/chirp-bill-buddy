import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useSuperbill } from "@/context/superbill-context";
import { usePatient } from "@/context/patient";
import { formatDate, formatCurrency } from "@/lib/utils/superbill-utils";
import { generateId } from "@/lib/utils/superbill-utils";
import { Superbill, Visit } from "@/types/superbill";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Users } from "lucide-react";

export function MultiSuperbillMerger() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { superbills, addSuperbill, clinicDefaults } = useSuperbill();
  const { patients } = usePatient();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedSuperbillIds, setSelectedSuperbillIds] = useState<string[]>([]);
  const [selectedVisitIds, setSelectedVisitIds] = useState<string[]>([]);
  const [patientSuperbills, setPatientSuperbills] = useState<Superbill[]>([]);

  useEffect(() => {
    if (selectedPatientId) {
      // Find all superbills for the selected patient
      const patient = patients.find(p => p.id === selectedPatientId);
      if (patient) {
        const patientBills = superbills.filter(bill => 
          bill.patientName === patient.name
        );
        setPatientSuperbills(patientBills);
        setSelectedSuperbillIds([]);
        setSelectedVisitIds([]);
      }
    }
  }, [selectedPatientId, superbills, patients]);

  useEffect(() => {
    // Update selected visits when superbills are selected
    const allVisits: string[] = [];
    selectedSuperbillIds.forEach(superbillId => {
      const superbill = superbills.find(s => s.id === superbillId);
      if (superbill) {
        superbill.visits.forEach(visit => {
          allVisits.push(visit.id);
        });
      }
    });
    setSelectedVisitIds(allVisits);
  }, [selectedSuperbillIds, superbills]);

  const handleSuperbillToggle = (superbillId: string, checked: boolean) => {
    if (checked) {
      setSelectedSuperbillIds(prev => [...prev, superbillId]);
    } else {
      setSelectedSuperbillIds(prev => prev.filter(id => id !== superbillId));
    }
  };

  const handleVisitToggle = (visitId: string, checked: boolean) => {
    if (checked) {
      setSelectedVisitIds(prev => [...prev, visitId]);
    } else {
      setSelectedVisitIds(prev => prev.filter(id => id !== visitId));
    }
  };

  const getSelectedVisits = (): Visit[] => {
    const visits: Visit[] = [];
    selectedSuperbillIds.forEach(superbillId => {
      const superbill = superbills.find(s => s.id === superbillId);
      if (superbill) {
        superbill.visits.forEach(visit => {
          if (selectedVisitIds.includes(visit.id)) {
            visits.push(visit);
          }
        });
      }
    });
    return visits;
  };

  const calculateTotalFee = (): number => {
    return getSelectedVisits().reduce((total, visit) => total + (visit.fee || 0), 0);
  };

  const handleMergeSuperbills = () => {
    if (selectedSuperbillIds.length < 2) {
      toast({
        title: "Selection Required",
        description: "Please select at least 2 superbills to merge.",
        variant: "destructive",
      });
      return;
    }

    if (selectedVisitIds.length === 0) {
      toast({
        title: "No Visits Selected",
        description: "Please select at least one visit to include in the merged superbill.",
        variant: "destructive",
      });
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    const selectedVisits = getSelectedVisits();
    const now = new Date();

    // Create merged superbill
    const mergedSuperbill: Superbill = {
      id: generateId(),
      patientName: patient.name,
      patientDob: new Date(patient.dob),
      issueDate: now,
      clinicName: clinicDefaults.clinicName,
      clinicAddress: clinicDefaults.clinicAddress,
      clinicPhone: clinicDefaults.clinicPhone,
      clinicEmail: clinicDefaults.clinicEmail,
      ein: clinicDefaults.ein,
      npi: clinicDefaults.npi,
      providerName: clinicDefaults.providerName,
      defaultIcdCodes: clinicDefaults.defaultIcdCodes,
      defaultCptCodes: clinicDefaults.defaultCptCodes,
      defaultMainComplaints: clinicDefaults.defaultMainComplaints,
      defaultFee: clinicDefaults.defaultFee,
      visits: selectedVisits.map(visit => ({
        ...visit,
        id: generateId(), // Generate new IDs to avoid conflicts
      })),
      createdAt: now,
      updatedAt: now,
      status: 'draft',
    };

    addSuperbill(mergedSuperbill);

    toast({
      title: "Superbills Merged Successfully",
      description: `Created new superbill with ${selectedVisits.length} visits.`,
    });

    navigate(`/superbill/${mergedSuperbill.id}`);
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="space-y-6">
      {/* Patient Selection */}
      <div>
        <label className="text-sm font-medium mb-2 block">Select Patient</label>
        <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose a patient..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border z-50">
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {patient.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPatient && patientSuperbills.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium mb-2">No Superbills Found</h4>
            <p className="text-muted-foreground">
              This patient doesn't have any existing superbills to merge.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedPatient && patientSuperbills.length > 0 && (
        <>
          {/* Superbill Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Available Superbills for {selectedPatient.name}
            </h3>
            <div className="space-y-3">
              {patientSuperbills.map((superbill) => (
                <Card key={superbill.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedSuperbillIds.includes(superbill.id)}
                        onCheckedChange={(checked) => 
                          handleSuperbillToggle(superbill.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {formatDate(superbill.issueDate)}
                            </span>
                            <Badge variant="outline">
                              {superbill.visits.length} visit{superbill.visits.length !== 1 ? 's' : ''}
                            </Badge>
                            <Badge variant="secondary">{superbill.status}</Badge>
                          </div>
                          <span className="font-medium">
                            {formatCurrency(superbill.visits.reduce((total, visit) => total + (visit.fee || 0), 0))}
                          </span>
                        </div>
                        
                        {selectedSuperbillIds.includes(superbill.id) && (
                          <div className="mt-3 pl-4 border-l-2 border-primary">
                            <h4 className="text-sm font-medium mb-2">Visits in this superbill:</h4>
                            <div className="space-y-2">
                              {superbill.visits.map((visit) => (
                                <div key={visit.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={selectedVisitIds.includes(visit.id)}
                                    onCheckedChange={(checked) => 
                                      handleVisitToggle(visit.id, checked as boolean)
                                    }
                                  />
                                  <span className="text-sm">
                                    {formatDate(visit.date)} - {formatCurrency(visit.fee || 0)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Summary and Action */}
          {selectedSuperbillIds.length > 0 && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Merge Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {selectedSuperbillIds.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Superbills Selected
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {selectedVisitIds.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Visits to Include
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(calculateTotalFee())}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Amount
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Button 
                  onClick={handleMergeSuperbills}
                  disabled={selectedSuperbillIds.length < 2 || selectedVisitIds.length === 0}
                  className="w-full"
                  size="lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Merged Superbill
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}