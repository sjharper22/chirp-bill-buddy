
import { Superbill } from "@/types/superbill";
import { formatStatus, getStatusVariant, calculateTotalFee } from "@/lib/utils/superbill-utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SuperbillCardProps } from "./types";
import { CardHeader } from "./CardHeader";
import { PatientInfo } from "./PatientInfo";
import { CardStats } from "./CardStats";
import { CardActions } from "./CardActions";

export function SuperbillCard({ superbill, onDelete, onClick }: SuperbillCardProps) {
  const totalFee = calculateTotalFee(superbill.visits);
  const visitCount = superbill.visits.length;
  
  // Get earliest and latest visit dates if visits exist
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  
  // Get all complaints from all visits
  const allComplaints: string[] = [];
  superbill.visits.forEach(visit => {
    if (visit.mainComplaints && visit.mainComplaints.length > 0) {
      visit.mainComplaints.forEach(complaint => {
        if (!allComplaints.includes(complaint)) {
          allComplaints.push(complaint);
        }
      });
    }
  });
  
  // Format status for display and get status variant
  const displayStatus = formatStatus(superbill.status);
  const statusVariant = getStatusVariant(superbill.status);
  
  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`} 
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <CardHeader 
          patientName={superbill.patientName}
          issueDate={superbill.issueDate}
          status={displayStatus}
          statusVariant={statusVariant}
        />
        
        <PatientInfo 
          patientDob={superbill.patientDob}
          visitDates={{ earliestDate, latestDate }}
          complaints={allComplaints}
        />
        
        <CardStats 
          visitCount={visitCount}
          totalFee={totalFee}
        />
      </CardContent>
      
      <CardFooter>
        <CardActions 
          superbillId={superbill.id}
          onDelete={onDelete}
        />
      </CardFooter>
    </Card>
  );
}
