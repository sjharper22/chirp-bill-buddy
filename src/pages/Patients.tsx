
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { PatientProfile } from "@/types/patient";
import { PatientList } from "@/components/patient/PatientList";
import { PatientForm } from "@/components/patient/PatientForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, User, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { patientService } from "@/services/patientService";

export default function Patients() {
  const navigate = useNavigate();
  const { isAdmin, isEditor, user } = useAuth();
  const { toast } = useToast();
  
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientProfile[]>([]);
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  const canEdit = isAdmin || isEditor;
  
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPatients();
    
    // Set up a refresh interval (every 60 seconds)
    const intervalId = setInterval(fetchPatients, 60000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);
  
  const handleAddPatient = async (patientData: Omit<PatientProfile, "id">) => {
    try {
      await patientService.create(patientData);
      setDialogOpen(false);
      toast({
        title: "Patient Added",
        description: `${patientData.name} has been added successfully.`,
      });
      fetchPatients();
    } catch (error: any) {
      console.error("Error adding patient:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add patient",
        variant: "destructive",
      });
    }
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
    setSelectedPatientIds(filteredPatients.map(patient => patient.id));
  };
  
  const clearPatientSelection = () => {
    setSelectedPatientIds([]);
  };
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Patient Profiles</h1>
          <p className="text-muted-foreground">
            Manage patient profiles and group patients for insurance submissions
          </p>
        </div>
        
        <div className="flex gap-2">
          {canEdit && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>New Patient</DialogTitle>
                </DialogHeader>
                <PatientForm 
                  onSubmit={handleAddPatient}
                  onCancel={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
          
          {selectedPatientIds.length > 0 && (
            <Button
              variant="secondary"
              onClick={() => navigate("/grouped-submission", { 
                state: { selectedPatientIds } 
              })}
            >
              Create Group Submission ({selectedPatientIds.length})
            </Button>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search patients..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <User className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-lg font-medium mt-4 mb-2">No patients added yet</p>
          <p className="text-muted-foreground mb-6">
            Add patient profiles to streamline your superbill creation process
          </p>
          {canEdit && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Patient
            </Button>
          )}
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-lg font-medium mb-2">No matching patients</p>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search criteria
          </p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      ) : (
        <PatientList
          patients={filteredPatients}
          selectedPatientIds={selectedPatientIds}
          togglePatientSelection={togglePatientSelection}
          onSelectAll={selectAllPatients}
          onClearSelection={clearPatientSelection}
          canEdit={canEdit}
          onRefresh={fetchPatients}
        />
      )}
    </div>
  );
}
