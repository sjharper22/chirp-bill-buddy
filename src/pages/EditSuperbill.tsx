
import { useParams, useNavigate } from "react-router-dom";
import { useSuperbill } from "@/context/superbill-context";
import { SuperbillForm } from "@/components/SuperbillForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditSuperbill() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSuperbill } = useSuperbill();
  
  const superbill = id ? getSuperbill(id) : undefined;
  
  if (!superbill) {
    return (
      <div className="container max-w-screen-xl mx-auto py-8 px-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-lg font-medium mb-2">Superbill not found</p>
          <p className="text-muted-foreground mb-6">
            The superbill you're looking for doesn't exist or has been deleted
          </p>
          <Button onClick={() => navigate("/")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>
      
      <h1 className="text-3xl font-bold mb-8">Edit Superbill</h1>
      <SuperbillForm existingSuperbill={superbill} />
    </div>
  );
}
