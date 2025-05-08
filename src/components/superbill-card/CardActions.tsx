
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, Eye, Trash2 } from "lucide-react";
import { CardActionsProps } from "./types";

export function CardActions({ superbillId, onDelete }: CardActionsProps) {
  return (
    <div className="border-t pt-4 pb-4 flex justify-between w-full">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering card onClick
          onDelete(superbillId);
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
          asChild 
          onClick={(e) => e.stopPropagation()} // Prevent triggering card onClick
        >
          <Link to={`/view/${superbillId}`}>
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
          <Link to={`/edit/${superbillId}`}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Link>
        </Button>
      </div>
    </div>
  );
}
