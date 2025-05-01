
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Import, Loader2, RefreshCw } from "lucide-react";
import { useSuperbill } from "@/context/superbill-context"; 
import { usePatient } from "@/context/patient-context";
import { useToast } from "@/components/ui/use-toast";

interface ImportPatientsButtonProps {
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
}

export function ImportPatientsButton({ onRefresh, isRefreshing }: ImportPatientsButtonProps) {
  const [importing, setImporting] = useState(false);
  const { superbills } = useSuperbill();
  const { addPatient, getPatient } = usePatient();
  const { toast } = useToast();

  const handleImportPatients = async () => {
    // Prevent duplicate imports
    if (importing) return;
    
    setImporting(true);
    try {
      let importedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;
      
      // Get unique patient names from superbills
      const uniquePatients = new Map();
      
      superbills.forEach(superbill => {
        if (!uniquePatients.has(superbill.patientName)) {
          uniquePatients.set(superbill.patientName, {
            name: superbill.patientName,
            dob: superbill.patientDob,
            lastSuperbillDate: superbill.issueDate,
            icdCodes: new Set(),
            cptCodes: new Set(),
          });
        }
        
        // Collect codes from visits
        const patientData = uniquePatients.get(superbill.patientName);
        superbill.visits.forEach(visit => {
          visit.icdCodes.forEach(code => patientData.icdCodes.add(code));
          visit.cptCodes.forEach(code => patientData.cptCodes.add(code));
        });
      });
      
      console.log("Found unique patients:", uniquePatients.size);
      
      // Process each unique patient
      for (const [name, data] of uniquePatients.entries()) {
        try {
          // Check if patient already exists
          const existingPatient = getPatient(name);
          
          if (!existingPatient) {
            // Create patient with collected data
            await addPatient({
              name: data.name,
              dob: data.dob,
              lastSuperbillDate: data.lastSuperbillDate,
              commonIcdCodes: Array.from(data.icdCodes),
              commonCptCodes: Array.from(data.cptCodes),
              notes: `Imported from superbills`
            });
            
            importedCount++;
          } else {
            skippedCount++;
          }
        } catch (error) {
          console.error(`Error importing patient ${name}:`, error);
          errorCount++;
        }
      }
      
      // Show success message
      if (importedCount > 0) {
        toast({
          title: `${importedCount} patients imported successfully`,
          description: skippedCount > 0 
            ? `${skippedCount} patients were already in your list.` 
            : "All superbill patients have been imported.",
        });
        
        // Refresh the patient list after import
        if (onRefresh) {
          await onRefresh();
        }
      } else if (skippedCount > 0) {
        toast({
          title: "No new patients imported",
          description: `All ${skippedCount} patients from superbills are already in your list.`,
        });
      } else {
        toast({
          title: "No patients to import",
          description: "No patients found in superbills.",
        });
      }
      
      if (errorCount > 0) {
        toast({
          title: "Warning",
          description: `${errorCount} patients couldn't be imported due to errors.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during patient import:", error);
      toast({
        title: "Error",
        description: "Failed to import patients from superbills.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  // Display a disabled button if there are no superbills
  const noSuperbills = !superbills || superbills.length === 0;

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleImportPatients}
        disabled={importing || noSuperbills}
        variant="outline"
        title={noSuperbills ? "No superbills available to import patients from" : "Import patients from existing superbills"}
      >
        {importing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <Import className="mr-2 h-4 w-4" />
            Import from Superbills
          </>
        )}
      </Button>
      
      {onRefresh && (
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Patients'}
        </Button>
      )}
    </div>
  );
}
