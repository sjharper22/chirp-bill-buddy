
import { Superbill } from "@/types/superbill";
import { formatCurrency, formatDate } from "@/lib/utils/superbill-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

interface CoverSheetProps {
  superbills: Superbill[];
}

export function CoverSheet({ superbills }: CoverSheetProps) {
  // Early return if no superbills
  if (!superbills.length) {
    return null;
  }
  
  // Use the first superbill for clinic info
  const firstSuperbill = superbills[0];
  
  // Count total patients (unique)
  const totalPatients = new Set(superbills.map(bill => bill.patientName)).size;
  
  // Count total visits
  const totalVisits = superbills.reduce((total, bill) => total + bill.visits.length, 0);
  
  // Calculate total charges
  const totalCharges = superbills.reduce((total, bill) => {
    return total + bill.visits.reduce((subtotal, visit) => subtotal + visit.fee, 0);
  }, 0);
  
  return (
    <div className="cover-sheet-container mb-8">
      <Card className="border-2">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <ClipboardList className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Insurance Submission Cover Sheet</CardTitle>
          <p className="text-muted-foreground">Generated on {formatDate(new Date())}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Submission Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{totalPatients}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Visits</p>
                <p className="text-2xl font-bold">{totalVisits}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Charges</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCharges)}</p>
              </div>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Provider Information</h3>
            <div className="space-y-1">
              <p><span className="font-medium">Provider:</span> {firstSuperbill.providerName}</p>
              <p><span className="font-medium">Clinic:</span> {firstSuperbill.clinicName}</p>
              <p><span className="font-medium">Address:</span> {firstSuperbill.clinicAddress}</p>
              <p><span className="font-medium">Phone:</span> {firstSuperbill.clinicPhone}</p>
              <p><span className="font-medium">Email:</span> {firstSuperbill.clinicEmail}</p>
              <p><span className="font-medium">EIN:</span> {firstSuperbill.ein}</p>
              <p><span className="font-medium">NPI #:</span> {firstSuperbill.npi}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Submission Instructions</h3>
            <div className="bg-muted p-4 rounded-md">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Submit all attached superbills to your insurance provider.</li>
                <li>Include this cover sheet with your submission.</li>
                <li>Keep copies of all documents for your records.</li>
                <li>Contact your insurance provider if you have any questions about the submission process.</li>
                <li>For billing questions, contact the provider using the information above.</li>
              </ol>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Included Patients</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {superbills.map((bill, index) => (
                <div key={bill.id} className="border p-2 rounded">
                  <p className="font-medium">{bill.patientName}</p>
                  <p className="text-sm text-muted-foreground">
                    DOB: {formatDate(bill.patientDob)}
                  </p>
                  <p className="text-sm">
                    Visits: {bill.visits.length}, 
                    Total: {formatCurrency(bill.visits.reduce((t, v) => t + v.fee, 0))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
