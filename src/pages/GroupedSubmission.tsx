
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "@/context/patient-context";
import { useSuperbill } from "@/context/superbill-context";
import { Superbill } from "@/types/superbill";
import { PatientProfile } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatCurrency } from "@/lib/utils/superbill-utils";
import { ArrowLeft, Search, Download, Mail, Check, Filter } from "lucide-react";
import { CoverSheet } from "@/components/cover-sheet/CoverSheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Preview } from "@/components/preview/Preview";
import { generatePrintableHTML } from "@/lib/utils/html-generator";

interface PatientWithSuperbills extends PatientProfile {
  superbills: Superbill[];
  totalVisits: number;
  totalAmount: number;
  status: "Complete" | "Missing Info" | "Draft" | "No Superbill";
  dateRange: { start: Date; end: Date } | null;
}

// Helper function to determine superbill status
const determineStatus = (superbills: Superbill[]): "Complete" | "Missing Info" | "Draft" | "No Superbill" => {
  if (superbills.length === 0) return "No Superbill";
  
  // A complete superbill has all required info
  const hasAllInfo = superbills.every(bill => 
    bill.patientName && 
    bill.visits.length > 0 && 
    bill.visits.every(visit => visit.icdCodes.length > 0 && visit.cptCodes.length > 0)
  );
  
  if (hasAllInfo) return "Complete";
  
  // If any visit is missing codes or fees, it's incomplete
  const hasMissingInfo = superbills.some(bill => 
    bill.visits.some(visit => 
      visit.icdCodes.length === 0 || 
      visit.cptCodes.length === 0 || 
      visit.fee <= 0
    )
  );
  
  if (hasMissingInfo) return "Missing Info";
  return "Draft";
};

export default function GroupedSubmission() {
  const navigate = useNavigate();
  const { patients } = usePatient();
  const { superbills } = useSuperbill();
  
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [patientsWithSuperbills, setPatientsWithSuperbills] = useState<PatientWithSuperbills[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewSuperbill, setPreviewSuperbill] = useState<Superbill | null>(null);
  const [showCoverSheet, setShowCoverSheet] = useState(false);
  
  // Process patients and their superbills
  useEffect(() => {
    const processed = patients.map(patient => {
      // Find superbills for this patient
      const patientSuperbills = superbills.filter(bill => bill.patientName === patient.name);
      
      // Calculate total visits and amount
      const totalVisits = patientSuperbills.reduce((total, bill) => total + bill.visits.length, 0);
      const totalAmount = patientSuperbills.reduce((total, bill) => {
        return total + bill.visits.reduce((subtotal, visit) => subtotal + visit.fee, 0);
      }, 0);
      
      // Determine date range across all visits
      let earliestDate: Date | null = null;
      let latestDate: Date | null = null;
      
      patientSuperbills.forEach(bill => {
        bill.visits.forEach(visit => {
          if (!earliestDate || visit.date < earliestDate) {
            earliestDate = visit.date;
          }
          if (!latestDate || visit.date > latestDate) {
            latestDate = visit.date;
          }
        });
      });
      
      // Set date range if we found valid dates
      const dateRange = (earliestDate && latestDate)
        ? { start: earliestDate, end: latestDate }
        : null;
      
      return {
        ...patient,
        superbills: patientSuperbills,
        totalVisits,
        totalAmount,
        status: determineStatus(patientSuperbills),
        dateRange
      };
    });
    
    setPatientsWithSuperbills(processed);
  }, [patients, superbills]);
  
  // Filter patients based on search and status
  const filteredPatients = patientsWithSuperbills.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? patient.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });
  
  // Handle selection
  const togglePatientSelection = (id: string) => {
    setSelectedPatientIds(prev => 
      prev.includes(id) 
        ? prev.filter(patientId => patientId !== id) 
        : [...prev, id]
    );
  };
  
  const selectAll = () => {
    setSelectedPatientIds(filteredPatients.map(patient => patient.id));
  };
  
  const clearSelection = () => {
    setSelectedPatientIds([]);
  };
  
  // Get selected patients and their superbills
  const selectedPatients = filteredPatients.filter(patient => 
    selectedPatientIds.includes(patient.id)
  );
  
  const selectedSuperbills = selectedPatients.flatMap(patient => patient.superbills);
  
  // Group statistics
  const groupTotalPatients = selectedPatients.length;
  const groupTotalVisits = selectedPatients.reduce((total, patient) => total + patient.totalVisits, 0);
  const groupTotalAmount = selectedPatients.reduce((total, patient) => total + patient.totalAmount, 0);
  
  // Handle print/download all
  const handleDownloadAll = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to download documents.');
      return;
    }
    
    // Start building the complete HTML content
    let completeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Grouped Superbill Submission</title>
          <style>
            @media print {
              .page-break { page-break-after: always; }
            }
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          </style>
        </head>
        <body>
    `;
    
    // Add cover sheet if any superbills are selected
    if (showCoverSheet && selectedSuperbills.length > 0) {
      const coverSheetHtml = generateCoverSheetHtml(selectedSuperbills);
      completeHtml += coverSheetHtml + '<div class="page-break"></div>';
    }
    
    // Add each superbill
    selectedSuperbills.forEach((superbill, index) => {
      const superbillHtml = generatePrintableHTML(superbill);
      // Extract the body content from the superbill HTML
      const bodyContent = superbillHtml.match(/<body>([\s\S]*)<\/body>/)?.[1] || '';
      completeHtml += bodyContent;
      
      // Add page break after each superbill except the last one
      if (index < selectedSuperbills.length - 1) {
        completeHtml += '<div class="page-break"></div>';
      }
    });
    
    // Close the HTML
    completeHtml += `
        </body>
      </html>
    `;
    
    // Write to the new window and print
    printWindow.document.open();
    printWindow.document.write(completeHtml);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
  
  // Generate HTML for cover sheet
  const generateCoverSheetHtml = (superbills: Superbill[]): string => {
    if (superbills.length === 0) return '';
    
    const firstSuperbill = superbills[0];
    const totalPatients = new Set(superbills.map(bill => bill.patientName)).size;
    const totalVisits = superbills.reduce((total, bill) => total + bill.visits.length, 0);
    const totalCharges = superbills.reduce((total, bill) => {
      return total + bill.visits.reduce((subtotal, visit) => subtotal + visit.fee, 0);
    }, 0);
    
    return `
      <div style="max-width: 800px; margin: 0 auto; border: 2px solid #ddd; padding: 20px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0;">Insurance Submission Cover Sheet</h1>
          <p style="color: #666;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
          <h3 style="margin-bottom: 10px;">Submission Summary</h3>
          <div style="display: flex; justify-content: space-between;">
            <div>
              <p style="color: #666; margin: 0;">Total Patients</p>
              <p style="font-size: 24px; font-weight: bold; margin: 0;">${totalPatients}</p>
            </div>
            <div>
              <p style="color: #666; margin: 0;">Total Visits</p>
              <p style="font-size: 24px; font-weight: bold; margin: 0;">${totalVisits}</p>
            </div>
            <div>
              <p style="color: #666; margin: 0;">Total Charges</p>
              <p style="font-size: 24px; font-weight: bold; margin: 0;">$${totalCharges.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
          <h3 style="margin-bottom: 10px;">Provider Information</h3>
          <p><span style="font-weight: 500;">Provider:</span> ${firstSuperbill.providerName}</p>
          <p><span style="font-weight: 500;">Clinic:</span> ${firstSuperbill.clinicName}</p>
          <p><span style="font-weight: 500;">Address:</span> ${firstSuperbill.clinicAddress}</p>
          <p><span style="font-weight: 500;">Phone:</span> ${firstSuperbill.clinicPhone}</p>
          <p><span style="font-weight: 500;">Email:</span> ${firstSuperbill.clinicEmail}</p>
          <p><span style="font-weight: 500;">EIN:</span> ${firstSuperbill.ein}</p>
          <p><span style="font-weight: 500;">NPI #:</span> ${firstSuperbill.npi}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="margin-bottom: 10px;">Submission Instructions</h3>
          <div style="background: #f7f7f7; padding: 15px; border-radius: 6px;">
            <ol style="padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 8px;">Submit all attached superbills to your insurance provider.</li>
              <li style="margin-bottom: 8px;">Include this cover sheet with your submission.</li>
              <li style="margin-bottom: 8px;">Keep copies of all documents for your records.</li>
              <li style="margin-bottom: 8px;">Contact your insurance provider if you have any questions about the submission process.</li>
              <li style="margin-bottom: 0;">For billing questions, contact the provider using the information above.</li>
            </ol>
          </div>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px;">
          <h3 style="margin-bottom: 10px;">Included Patients</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px;">
            ${superbills.map(bill => `
              <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
                <p style="font-weight: 500; margin: 0;">${bill.patientName}</p>
                <p style="color: #666; font-size: 14px; margin: 5px 0;">DOB: ${new Date(bill.patientDob).toLocaleDateString()}</p>
                <p style="font-size: 14px; margin: 0;">
                  Visits: ${bill.visits.length}, 
                  Total: $${bill.visits.reduce((t, v) => t + v.fee, 0).toFixed(2)}
                </p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Complete":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
      case "Missing Info":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">{status}</Badge>;
      case "Draft":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{status}</Badge>;
      case "No Superbill":
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Group Submissions</h1>
          <p className="text-muted-foreground">
            Manage and submit multiple superbills together
          </p>
        </div>
        
        {selectedPatientIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
            <div className="text-sm font-medium mr-2">
              <span className="px-2 py-1 bg-primary/10 rounded-md">
                {groupTotalPatients} Patient{groupTotalPatients !== 1 ? 's' : ''}
              </span>
              <span className="px-2 py-1 bg-primary/10 rounded-md ml-2">
                {groupTotalVisits} Visit{groupTotalVisits !== 1 ? 's' : ''}
              </span>
              <span className="px-2 py-1 bg-primary/10 rounded-md ml-2">
                {formatCurrency(groupTotalAmount)}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSelection}
              className="text-xs"
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search patients..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilterStatus(null)}
              className={`mr-2 ${!filterStatus ? 'bg-muted' : ''}`}
            >
              <Filter className="mr-2 h-4 w-4" />
              All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilterStatus("Complete")}
              className={filterStatus === "Complete" ? 'bg-muted' : ''}
            >
              Complete
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilterStatus("Missing Info")}
              className={filterStatus === "Missing Info" ? 'bg-muted' : ''}
            >
              Missing Info
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilterStatus("Draft")}
              className={filterStatus === "Draft" ? 'bg-muted' : ''}
            >
              Draft
            </Button>
          </div>
        </div>
      </div>
      
      {selectedPatientIds.length > 0 && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Bulk Actions</h3>
              <p className="text-sm text-muted-foreground">
                Apply actions to {selectedPatientIds.length} selected patient{selectedPatientIds.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center mr-4">
                <Checkbox 
                  id="cover-sheet" 
                  checked={showCoverSheet}
                  onCheckedChange={() => setShowCoverSheet(!showCoverSheet)}
                />
                <label 
                  htmlFor="cover-sheet" 
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include cover sheet
                </label>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadAll}
                disabled={selectedSuperbills.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Download All PDFs
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={selectedSuperbills.length === 0}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email to Patients
              </Button>
              {showCoverSheet && selectedSuperbills.length > 0 && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (!printWindow) {
                      alert('Please allow pop-ups to print the cover sheet.');
                      return;
                    }
                    
                    const coverSheetHtml = `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Submission Cover Sheet</title>
                          <style>
                            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                          </style>
                        </head>
                        <body>
                          ${generateCoverSheetHtml(selectedSuperbills)}
                        </body>
                      </html>
                    `;
                    
                    printWindow.document.open();
                    printWindow.document.write(coverSheetHtml);
                    printWindow.document.close();
                    
                    setTimeout(() => {
                      printWindow.print();
                    }, 500);
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Print Cover Sheet Only
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {filteredPatients.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={filteredPatients.length > 0 && selectedPatientIds.length === filteredPatients.length}
                    onCheckedChange={() => {
                      if (selectedPatientIds.length === filteredPatients.length) {
                        clearSelection();
                      } else {
                        selectAll();
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead>Total Billed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedPatientIds.includes(patient.id)}
                      onCheckedChange={() => togglePatientSelection(patient.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>
                    {patient.dateRange ? (
                      `${formatDate(patient.dateRange.start)} - ${formatDate(patient.dateRange.end)}`
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>{patient.totalVisits}</TableCell>
                  <TableCell>{formatCurrency(patient.totalAmount)}</TableCell>
                  <TableCell>{renderStatusBadge(patient.status)}</TableCell>
                  <TableCell className="text-right">
                    {patient.superbills.length > 0 ? (
                      <div className="flex justify-end gap-2">
                        <Dialog open={dialogOpen && previewSuperbill?.patientName === patient.name} onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (!open) setPreviewSuperbill(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setPreviewSuperbill(patient.superbills[0]);
                                setDialogOpen(true);
                              }}
                            >
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Superbill Preview</DialogTitle>
                            </DialogHeader>
                            {previewSuperbill && (
                              <Preview superbill={previewSuperbill} />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/edit/${patient.superbills[0].id}`)}
                        >
                          Edit
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => {
                          navigate("/new", { state: { patientId: patient.id } });
                        }}
                      >
                        Create Superbill
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-lg font-medium mb-2">No patients found</p>
          <p className="text-muted-foreground mb-6">
            {searchTerm || filterStatus ? "Try adjusting your search or filters" : "Add patients to create group submissions"}
          </p>
          <Button onClick={() => navigate("/patients")}>
            Manage Patients
          </Button>
        </div>
      )}
      
      {showCoverSheet && selectedSuperbills.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Cover Sheet Preview</h2>
          <CoverSheet superbills={selectedSuperbills} />
        </div>
      )}
    </div>
  );
}
