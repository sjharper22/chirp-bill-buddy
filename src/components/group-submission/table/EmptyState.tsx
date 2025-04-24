
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function EmptyState() {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-lg">
      <p className="text-lg font-medium mb-2">No patients found</p>
      <p className="text-muted-foreground mb-6">
        Try adjusting your search or filters
      </p>
      <Button onClick={() => navigate("/patients")}>
        Manage Patients
      </Button>
    </div>
  );
}
