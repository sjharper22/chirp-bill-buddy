import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, Eye, Trash2 } from "lucide-react";
import { CardActionsProps } from "./types";

export function CardActions({ 
  superbillId, 
  onDelete,
  compact
}: CardActionsProps) {
  if (!onDelete) return null;
  
  return (
    <div className="flex justify-between w-full">
      <Button 
        variant="outline" 
        size={compact ? "xs" : "sm"}
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering parent onClick
          onDelete(superbillId);
        }}
        className="text-destructive hover:text-destructive/90"
      >
        <Trash2 className={`${compact ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
        Delete
      </Button>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size={compact ? "xs" : "sm"}
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link to={`/view/${superbillId}`}>
            <Eye className={`${compact ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
            View
          </Link>
        </Button>
        
        <Button
          variant="outline"
          size={compact ? "xs" : "sm"}
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link to={`/edit/${superbillId}`}>
            <Edit className={`${compact ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
            Edit
          </Link>
        </Button>
      </div>
    </div>
  );
}
