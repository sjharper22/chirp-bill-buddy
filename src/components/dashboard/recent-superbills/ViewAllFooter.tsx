
import { Button } from "@/components/ui/button";

interface ViewAllFooterProps {
  displaySuperbillsCount: number;
  totalSuperbills: number;
  selectionMode: boolean;
}

export function ViewAllFooter({ displaySuperbillsCount, totalSuperbills, selectionMode }: ViewAllFooterProps) {
  if (displaySuperbillsCount === 0 || selectionMode || displaySuperbillsCount >= totalSuperbills) {
    return null;
  }

  return (
    <div className="flex justify-center mt-6">
      <Button 
        variant="outline" 
        onClick={() => window.location.href = "/grouped-submission"}
        className="mx-auto"
      >
        View All Superbills
      </Button>
    </div>
  );
}
