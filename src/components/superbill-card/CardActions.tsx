
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, Eye, Trash2 } from "lucide-react";
import { CardActionsProps } from "./types";

export function CardActions({ superbillId, onDelete, isCollapsed, isExpanded }: CardActionsProps) {
  return (
    <div className={`border-t pt-4 pb-4 flex flex-wrap gap-2 p-4 transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden border-transparent'}`}>
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
