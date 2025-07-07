import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, Filter, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { usePatient } from "@/context/patient";
import { Visit, visitService } from "@/services/visitService";
import { useSuperbill } from "@/context/superbill-context";
import { formatDate, formatCurrency, generateId } from "@/lib/utils/superbill-utils";
import { Superbill } from "@/types/superbill";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";

export function DateRangeSuperbillGenerator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { patients } = usePatient();
  const { addSuperbill, clinicDefaults } = useSuperbill();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [availableVisits, setAvailableVisits] = useState<Visit[]>([]);
  const [selectedVisitIds, setSelectedVisitIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (selectedPatientId && dateRange?.from && dateRange?.to) {
      loadVisitsInDateRange();
    } else {
      setAvailableVisits([]);
      setSelectedVisitIds([]);
    }
  }, [selectedPatientId, dateRange]);

  const loadVisitsInDateRange = async () => {
    if (!selectedPatientId || !dateRange?.from || !dateRange?.to) return;

    try {
      setLoading(true);
      const allVisits = await visitService.getVisitsByPatient(selectedPatientId);
      
      // Filter visits within the date range
      const filteredVisits = allVisits.filter(visit => {
        const visitDate = new Date(visit.visit_date);
        return visitDate >= dateRange.from! && visitDate <= dateRange.to!;
      });

      setAvailableVisits(filteredVisits);
      // Auto-select all visits by default
      setSelectedVisitIds(filteredVisits.map(visit => visit.id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load visits: ${error.message}`,
        variant: "destructive",
      });
      setAvailableVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitToggle = (visitId: string, checked: boolean) => {
    if (checked) {
      setSelectedVisitIds(prev => [...prev, visitId]);
    } else {
      setSelectedVisitIds(prev => prev.filter(id => id !== visitId));
    }
  };

  const getFilteredVisits = () => {
    if (statusFilter === "all") return availableVisits;
    return availableVisits.filter(visit => visit.status === statusFilter);
  };

  const getSelectedVisits = () => {
    const filteredVisits = getFilteredVisits();
    return filteredVisits.filter(visit => selectedVisitIds.includes(visit.id));
  };

  const calculateTotalFee = (): number => {
    return getSelectedVisits().reduce((total, visit) => total + (visit.fee || 0), 0);
  };

  const handleGenerateSuperbill = () => {
    if (!selectedPatientId || selectedVisitIds.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select a patient and at least one visit.",
        variant: "destructive",
      });
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    const selectedVisits = getSelectedVisits();
    const now = new Date();

    // Convert database visits to superbill visits format
    const superbillVisits = selectedVisits.map(visit => ({
      id: generateId(),
      date: new Date(visit.visit_date),
      icdCodes: Array.isArray(visit.icd_codes) ? visit.icd_codes as string[] : [],
      cptCodes: Array.isArray(visit.cpt_codes) ? visit.cpt_codes as string[] : [],
      cptCodeEntries: visit.cpt_code_entries || [],
      fee: visit.fee || 0,
      notes: visit.notes || "",
      mainComplaints: Array.isArray(visit.main_complaints) ? visit.main_complaints as string[] : [],
      status: 'draft' as const,
    }));

    // Create new superbill
    const newSuperbill: Superbill = {
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
      visits: superbillVisits,
      createdAt: now,
      updatedAt: now,
      status: 'draft',
    };

    addSuperbill(newSuperbill);

    toast({
      title: "Superbill Generated Successfully",
      description: `Created superbill with ${selectedVisits.length} visits from ${format(dateRange?.from || now, "PP")} to ${format(dateRange?.to || now, "PP")}.`,
    });

    navigate(`/superbill/${newSuperbill.id}`);
  };

  const selectAll = () => {
    const filteredVisits = getFilteredVisits();
    setSelectedVisitIds(filteredVisits.map(visit => visit.id));
  };

  const clearAll = () => {
    setSelectedVisitIds([]);
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const filteredVisits = getFilteredVisits();
  const selectedVisits = getSelectedVisits();

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

      {/* Date Range Selection */}
      {selectedPatient && (
        <div>
          <label className="text-sm font-medium mb-2 block">Select Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-background",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border border-border z-50" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Visits List */}
      {selectedPatient && dateRange?.from && dateRange?.to && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Visits from {format(dateRange.from, "PP")} to {format(dateRange.to, "PP")}
            </h3>
            
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-background">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unbilled">Unbilled</SelectItem>
                  <SelectItem value="included_in_superbill">Billed</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </div>

          {loading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-sm text-muted-foreground">Loading visits...</div>
              </CardContent>
            </Card>
          ) : filteredVisits.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h4 className="text-lg font-medium mb-2">No Visits Found</h4>
                <p className="text-muted-foreground">
                  No visits found for {selectedPatient.name} in the selected date range.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredVisits.map((visit) => (
                <Card key={visit.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedVisitIds.includes(visit.id)}
                        onCheckedChange={(checked) => 
                          handleVisitToggle(visit.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {formatDate(new Date(visit.visit_date))}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {visit.status}
                            </Badge>
                          </div>
                          <span className="font-medium">
                            {formatCurrency(visit.fee || 0)}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          {visit.icd_codes && Array.isArray(visit.icd_codes) && visit.icd_codes.length > 0 && (
                            <div>
                              <span className="text-muted-foreground">ICD:</span> {(visit.icd_codes as string[]).join(", ")}
                            </div>
                          )}
                          {visit.cpt_codes && Array.isArray(visit.cpt_codes) && visit.cpt_codes.length > 0 && (
                            <div>
                              <span className="text-muted-foreground">CPT:</span> {(visit.cpt_codes as string[]).join(", ")}
                            </div>
                          )}
                          {visit.main_complaints && Array.isArray(visit.main_complaints) && visit.main_complaints.length > 0 && (
                            <div>
                              <span className="text-muted-foreground">Complaints:</span> {(visit.main_complaints as string[]).join(", ")}
                            </div>
                          )}
                          {visit.notes && (
                            <div>
                              <span className="text-muted-foreground">Notes:</span> {visit.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary and Action */}
          {selectedVisits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedVisits.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Visits Selected
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {format(dateRange?.from || new Date(), "MMM yyyy")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Date Range
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(calculateTotalFee())}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Amount
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateSuperbill}
                  disabled={selectedVisits.length === 0}
                  className="w-full"
                  size="lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Superbill from Date Range
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}