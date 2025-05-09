
import { useState } from "react";
import { Superbill } from "@/types/superbill";
import { toast } from "@/components/ui/use-toast";

export function useCardExpansion(
  filteredSuperbills: Superbill[],
  isCompactView: boolean,
  setIsCompactView: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [expandedCardIds, setExpandedCardIds] = useState<string[]>([]);

  // Toggle individual card expansion
  const handleToggleCardExpand = (id: string) => {
    setExpandedCardIds(prevIds => {
      if (prevIds.includes(id)) {
        return prevIds.filter(cardId => cardId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  // Toggle global compact view
  const handleViewModeToggle = () => {
    // Get all visible superbill IDs
    const allVisibleIds = filteredSuperbills.map(bill => bill.id);
    
    if (isCompactView) {
      // Expand all cards - important to use ALL visible IDs
      setExpandedCardIds(allVisibleIds);
      toast({
        description: "Expanded all cards",
        duration: 2000,
      });
    } else {
      // Collapse all cards
      setExpandedCardIds([]);
      toast({
        description: "Collapsed all cards",
        duration: 2000,
      });
    }
    
    setIsCompactView(!isCompactView);
  };

  return {
    expandedCardIds,
    handleToggleCardExpand,
    handleViewModeToggle
  };
}
