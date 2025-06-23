import { Superbill } from "@/types/superbill";
import { formatDate, formatCurrency, calculateTotalFee } from "@/lib/utils/superbill-utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Eye, Trash2, GripHorizontal, Copy } from "lucide-react";
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";
import { useSuperbill } from "@/context/superbill-context";
import { useToast } from "@/components/ui/use-toast";

interface SuperbillCardProps {
  superbill: Superbill;
  onDelete: (id: string) => void;
  onClick?: () => void; // Add optional onClick prop
}

export function SuperbillCard({ superbill, onDelete, onClick }: SuperbillCardProps) {
  const navigate = useNavigate();
  const { duplicateSuperbill } = useSuperbill();
  const { toast } = useToast();
  
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
  
  // Display logic for complaints (showing up to 2, then "and X more")
  const complaintsDisplay = allComplaints.length > 0 
    ? (allComplaints.length > 2
        ? `${allComplaints.slice(0, 2).join(", ")} and ${allComplaints.length - 2} more`
        : allComplaints.join(", "))
    : null;
    
  // Map status to variant for StatusBadge
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'info';
      case 'in_progress': return 'warning';
      case 'in_review': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card onClick
    
    try {
      const newId = duplicateSuperbill(superbill.id);
      
      toast({
        title: "Superbill duplicated",
        description: `Created a copy of ${superbill.patientName}'s superbill`,
      });
      
      // Navigate to edit the new duplicated superbill
      navigate(`/edit/${newId}`);
    } catch (error) {
      console.error("Error duplicating superbill:", error);
      toast({
        title: "Error duplicating superbill",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`} 
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <GripHorizontal className="h-4 w-4 mr-2 text-muted-foreground drag-handle" />
            <h3 className="font-semibold text-lg truncate max-w-[180px]">{superbill.patientName}</h3>
          </div>
          <div className="text-sm bg-primary/10 text-primary font-medium px-2 py-0.5 rounded">
            {formatDate(superbill.issueDate)}
          </div>
        </div>
        
        <div className="mb-2">
          <StatusBadge 
            status={formatStatus(superbill.status)} 
            variant={getStatusVariant(superbill.status)}
          />
        </div>
        
        <div className="text-sm text-muted-foreground mb-4">
          <p>DOB: {formatDate(superbill.patientDob)}</p>
          {visitDates.length > 0 && (
            <p>
              Visit Period: {formatDate(earliestDate)} to {formatDate(latestDate)}
            </p>
          )}
          {complaintsDisplay && (
            <p className="mt-1 font-medium text-foreground line-clamp-1">
              Primary Complaints: {complaintsDisplay}
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
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering card onClick
            onDelete(superbill.id);
          }}
          className="text-destructive hover:text-destructive/90"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDuplicate}
          >
            <Copy className="h-4 w-4 mr-1" />
            Duplicate
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            onClick={(e) => e.stopPropagation()} // Prevent triggering card onClick
          >
            <Link to={`/view/${superbill.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            onClick={(e) => e.stopPropagation()} // Prevent triggering card onClick
          >
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
