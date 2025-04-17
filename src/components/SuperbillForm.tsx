
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Superbill, Visit } from "@/types/superbill";
import { useSuperbill } from "@/context/superbill-context";
import { 
  generateId, 
  createEmptyVisit, 
  calculateTotalFee, 
  formatCurrency, 
  formatDate, 
  commonICD10Codes, 
  commonCPTCodes 
} from "@/lib/utils/superbill-utils";
import { VisitEntry } from "@/components/VisitEntry";
import { MultiTagInput } from "@/components/MultiTagInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CalendarIcon, Plus, Calendar as CalendarRange, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SuperbillFormProps {
  existingSuperbill?: Superbill;
}

export function SuperbillForm({ existingSuperbill }: SuperbillFormProps) {
  const navigate = useNavigate();
  const { addSuperbill, updateSuperbill, clinicDefaults } = useSuperbill();
  
  const today = new Date();
  
  // Initialize form with existing data or defaults
  const [superbill, setSuperbill] = useState<Omit<Superbill, "id" | "createdAt" | "updatedAt">>(() => {
    if (existingSuperbill) {
      return { ...existingSuperbill };
    }
    
    return {
      patientName: "",
      patientDob: new Date(),
      issueDate: today,
      dateRangeStart: today,
      dateRangeEnd: today,
      clinicName: clinicDefaults.clinicName,
      clinicAddress: clinicDefaults.clinicAddress,
      clinicPhone: clinicDefaults.clinicPhone,
      clinicEmail: clinicDefaults.clinicEmail,
      ein: clinicDefaults.ein,
      npi: clinicDefaults.npi,
      providerName: clinicDefaults.providerName,
      defaultIcdCodes: [...clinicDefaults.defaultIcdCodes],
      defaultCptCodes: [...clinicDefaults.defaultCptCodes],
      defaultFee: clinicDefaults.defaultFee,
      visits: []
    };
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!superbill.patientName) {
      alert("Please enter a patient name");
      return;
    }
    
    const now = new Date();
    
    if (existingSuperbill) {
      updateSuperbill(existingSuperbill.id, {
        ...superbill,
        id: existingSuperbill.id,
        createdAt: existingSuperbill.createdAt,
        updatedAt: now
      });
    } else {
      addSuperbill({
        ...superbill,
        id: generateId(),
        createdAt: now,
        updatedAt: now
      });
    }
    
    navigate("/");
  };
  
  // Update form fields
  const updateField = <K extends keyof typeof superbill>(
    field: K,
    value: (typeof superbill)[K]
  ) => {
    setSuperbill(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle updates to visits array
  const updateVisit = (updatedVisit: Visit) => {
    setSuperbill(prev => ({
      ...prev,
      visits: prev.visits.map(visit => 
        visit.id === updatedVisit.id ? updatedVisit : visit
      )
    }));
  };
  
  // Add a new visit
  const addVisit = () => {
    const newVisit = createEmptyVisit(
      superbill.defaultIcdCodes,
      superbill.defaultCptCodes,
      superbill.defaultFee
    );
    
    setSuperbill(prev => ({
      ...prev,
      visits: [...prev.visits, newVisit]
    }));
  };
  
  // Duplicate a visit
  const duplicateVisit = (visit: Visit) => {
    setSuperbill(prev => ({
      ...prev,
      visits: [...prev.visits, visit]
    }));
  };
  
  // Delete a visit
  const deleteVisit = (id: string) => {
    setSuperbill(prev => ({
      ...prev,
      visits: prev.visits.filter(visit => visit.id !== id)
    }));
  };
  
  // Update all visits when default codes/fee change
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
        fee: prev.defaultFee
      }))
    }));
  };
  
  // Calculate total fee
  const totalFee = calculateTotalFee(superbill.visits);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
          <CardDescription>Enter the patient's details for this superbill</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                value={superbill.patientName}
                onChange={e => updateField("patientName", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patientDob">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="patientDob"
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {superbill.patientDob ? (
                      format(superbill.patientDob, "PP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={superbill.patientDob}
                    onSelect={date => date && updateField("patientDob", date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Invoice/Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="issueDate"
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {superbill.issueDate ? (
                      format(superbill.issueDate, "PP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={superbill.issueDate}
                    onSelect={date => date && updateField("issueDate", date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range Covered</Label>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left flex-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {superbill.dateRangeStart ? (
                        format(superbill.dateRangeStart, "PP")
                      ) : (
                        <span>Start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={superbill.dateRangeStart}
                      onSelect={date => date && updateField("dateRangeStart", date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                
                <span>to</span>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left flex-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {superbill.dateRangeEnd ? (
                        format(superbill.dateRangeEnd, "PP")
                      ) : (
                        <span>End date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={superbill.dateRangeEnd}
                      onSelect={date => date && updateField("dateRangeEnd", date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Clinic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Clinic & Provider Information</CardTitle>
          <CardDescription>Verify the clinic details for this superbill</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input
                id="clinicName"
                value={superbill.clinicName}
                onChange={e => updateField("clinicName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="providerName">Provider Name</Label>
              <Input
                id="providerName"
                value={superbill.providerName}
                onChange={e => updateField("providerName", e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clinicAddress">Clinic Address</Label>
            <Input
              id="clinicAddress"
              value={superbill.clinicAddress}
              onChange={e => updateField("clinicAddress", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clinicPhone">Clinic Phone</Label>
              <Input
                id="clinicPhone"
                value={superbill.clinicPhone}
                onChange={e => updateField("clinicPhone", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clinicEmail">Clinic Email</Label>
              <Input
                id="clinicEmail"
                value={superbill.clinicEmail}
                onChange={e => updateField("clinicEmail", e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ein">EIN (Tax ID)</Label>
              <Input
                id="ein"
                value={superbill.ein}
                onChange={e => updateField("ein", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="npi">NPI #</Label>
              <Input
                id="npi"
                value={superbill.npi}
                onChange={e => updateField("npi", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Default Code Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Default Code Settings</CardTitle>
          <CardDescription>
            Set default codes and fees for new visits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultIcdCodes">Default ICD-10 Codes</Label>
            <MultiTagInput
              placeholder="Add ICD-10 Codes"
              tags={superbill.defaultIcdCodes}
              onChange={codes => updateField("defaultIcdCodes", codes)}
              suggestions={commonICD10Codes}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultCptCodes">Default CPT Codes</Label>
            <MultiTagInput
              placeholder="Add CPT Codes"
              tags={superbill.defaultCptCodes}
              onChange={codes => updateField("defaultCptCodes", codes)}
              suggestions={commonCPTCodes}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultFee">Default Fee per Visit ($)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="defaultFee"
                type="number"
                min="0"
                step="0.01"
                value={superbill.defaultFee || ""}
                onChange={e => updateField("defaultFee", parseFloat(e.target.value) || 0)}
                className="max-w-xs"
              />
              
              {superbill.visits.length > 0 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={updateVisitsWithDefaults}
                >
                  Apply to All Visits
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Visit Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Visit Entries</CardTitle>
          <CardDescription>
            Add and manage visit information for this superbill
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {superbill.visits.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No visits added yet.</p>
              <Button 
                type="button"
                onClick={addVisit}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Visit
              </Button>
            </div>
          ) : (
            <div>
              {superbill.visits.map(visit => (
                <VisitEntry
                  key={visit.id}
                  visit={visit}
                  onVisitChange={updateVisit}
                  onDuplicate={duplicateVisit}
                  onDelete={deleteVisit}
                />
              ))}
              
              <div className="flex justify-between items-center mt-4">
                <Button 
                  type="button"
                  onClick={addVisit}
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Visit
                </Button>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Fee:</p>
                  <p className="text-xl font-bold">{formatCurrency(totalFee)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-6 mt-4">
          <Button className="ml-auto" type="submit">
            <Save className="mr-2 h-4 w-4" />
            {existingSuperbill ? "Update Superbill" : "Save Superbill"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
