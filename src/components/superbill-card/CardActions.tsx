
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Eye, Trash2, Copy } from "lucide-react";
import { CardActionsProps } from "./types";
import { useSuperbill } from "@/context/superbill-context";
import { useToast } from "@/components/ui/use-toast";

export function CardActions({ superbillId, onDelete, isCollapsed, isExpanded }: CardActionsProps) {
  const navigate = useNavigate();
  const { duplicateSuperbill, getSuperbill } = useSuperbill();
  const { toast } = useToast();

  // Only render content if expanded
  if (!isExpanded) {
    return null; // Don't render anything when not expanded
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card onClick
    
    try {
      const originalSuperbill = getSuperbill(superbillId);
      if (!originalSuperbill) {
        toast({
          title: "Error",
          description: "Could not find superbill to duplicate",
          variant: "destructive",
        });
        return;
      }

      const newId = duplicateSuperbill(superbillId);
      
      toast({
        title: "Superbill duplicated",
        description: `Created a copy of ${originalSuperbill.patientName}'s superbill`,
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
    <div className="border-t pt-4 pb-4 flex flex-wrap gap-2 p-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering card onClick
          onDelete(superbillId);
        }}
        className="text-destructive hover:text-destructive/90 mr-auto"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        <span className={isCollapsed ? "hidden sm:inline" : ""}>Delete</span>
      </Button>
      
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDuplicate}
        >
          <Copy className="h-4 w-4 mr-1" />
          <span className={isCollapsed ? "hidden sm:inline" : ""}>Duplicate</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          asChild 
          onClick={(e) => e.stopPropagation()} // Prevent triggering card onClick
        >
          <Link to={`/view/${superbillId}`}>
            <Eye className="h-4 w-4 mr-1" />
            <span className={isCollapsed ? "hidden sm:inline" : ""}>View</span>
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          onClick={(e) => e.stopPropagation()} // Prevent triggering card onClick
        >
          <Link to={`/edit/${superbillId}`}>
            <Edit className="h-4 w-4 mr-1" />
            <span className={isCollapsed ? "hidden sm:inline" : ""}>Edit</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
