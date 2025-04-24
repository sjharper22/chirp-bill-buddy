
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Superbill } from "@/types/superbill";

interface TableActionsProps {
  superbills: Superbill[];
  patientId: string;
  onPreview: (superbill: Superbill) => void;
}

export function TableActions({ superbills, patientId, onPreview }: TableActionsProps) {
  const navigate = useNavigate();
  
  if (superbills.length > 0) {
    return (
      <div className="flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onPreview(superbills[0])}
        >
          Preview
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(`/edit/${superbills[0].id}`)}
        >
          Edit
        </Button>
      </div>
    );
  }
  
  return (
    <Button 
      size="sm"
      onClick={() => {
        navigate("/new", { state: { patientId } });
      }}
    >
      Create Superbill
    </Button>
  );
}
