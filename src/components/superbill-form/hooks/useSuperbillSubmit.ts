
import { useNavigate } from "react-router-dom";
import { useSuperbill } from "@/context/superbill-context";
import { useToast } from "@/components/ui/use-toast";
import { Superbill } from "@/types/superbill";
import { generateId } from "@/lib/utils/superbill-utils";
import { visitService } from "@/services/visitService";

/**
 * Hook for handling superbill form submission
 */
export function useSuperbillSubmit(
  superbill: Omit<Superbill, "id" | "createdAt" | "updatedAt">,
  existingSuperbill?: Superbill
) {
  const navigate = useNavigate();
  const { addSuperbill, updateSuperbill } = useSuperbill();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const now = new Date();
      
      if (existingSuperbill) {
        // Update existing superbill
        const updatedSuperbill: Superbill = {
          ...superbill,
          id: existingSuperbill.id,
          createdAt: existingSuperbill.createdAt,
          updatedAt: now,
          status: existingSuperbill.status
        };
        
        updateSuperbill(existingSuperbill.id, updatedSuperbill);
        
        toast({
          title: "Superbill updated successfully",
          description: `Updated superbill for ${superbill.patientName}`,
        });
        
        navigate(`/view/${existingSuperbill.id}`);
      } else {
        // Create new superbill
        const newSuperbillId = generateId();
        const newSuperbill: Superbill = {
          ...superbill,
          id: newSuperbillId,
          createdAt: now,
          updatedAt: now,
          status: 'draft'
        };
        
        addSuperbill(newSuperbill);

        // If visits have database IDs, link them to the superbill
        const visitIds = superbill.visits
          .map(visit => visit.id)
          .filter(id => id && id.length > 10); // Filter for UUID-like IDs

        if (visitIds.length > 0) {
          try {
            await visitService.linkVisitsToSuperbill(newSuperbillId, visitIds);
          } catch (error) {
            console.error("Failed to link visits to superbill:", error);
            // Don't fail the entire submission for this
          }
        }
        
        toast({
          title: "Superbill created successfully",
          description: `Created superbill for ${superbill.patientName} with ${superbill.visits.length} visit${superbill.visits.length !== 1 ? 's' : ''}`,
        });
        
        navigate(`/view/${newSuperbillId}`);
      }
    } catch (error) {
      console.error("Error saving superbill:", error);
      toast({
        title: "Error saving superbill",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
}
