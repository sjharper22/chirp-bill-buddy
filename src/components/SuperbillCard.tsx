
import { Superbill } from "@/types/superbill";
import { formatDate, formatCurrency, calculateTotalFee } from "@/lib/utils/superbill-utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, Eye, Trash2 } from "lucide-react";

interface SuperbillCardProps {
  superbill: Superbill;
  onDelete: (id: string) => void;
}

export function SuperbillCard({ superbill, onDelete }: SuperbillCardProps) {
  const totalFee = calculateTotalFee(superbill.visits);
  const visitCount = superbill.visits.length;
  
  // Get earliest and latest visit dates if visits exist
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{superbill.patientName}</h3>
          <div className="text-sm bg-primary/10 text-primary font-medium px-2 py-0.5 rounded">
            {formatDate(superbill.issueDate)}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-4">
          <p>DOB: {formatDate(superbill.patientDob)}</p>
          {visitDates.length > 0 && (
            <p>
              Visit Period: {formatDate(earliestDate)} to {formatDate(latestDate)}
            </p>
          )}
        </div>
        
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Visits</p>
            <p className="font-medium">{visitCount}</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-bold">{formatCurrency(totalFee)}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 pb-4 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(superbill.id)}
          className="text-destructive hover:text-destructive/90"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/view/${superbill.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
          
          <Button variant="outline" size="sm" asChild>
            <Link to={`/edit/${superbill.id}`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
