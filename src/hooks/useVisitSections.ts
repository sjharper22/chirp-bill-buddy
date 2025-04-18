
import { useState } from 'react';

export type VisitSection = 'date' | 'complaints' | 'codes' | 'fee' | 'notes';

interface UseVisitSectionsProps {
  defaultOrder?: VisitSection[];
}

export function useVisitSections({ defaultOrder = ['date', 'complaints', 'codes', 'fee', 'notes'] }: UseVisitSectionsProps = {}) {
  const [sectionOrder, setSectionOrder] = useState<VisitSection[]>(defaultOrder);

  const moveSection = (fromIndex: number, toIndex: number) => {
    setSectionOrder(prevOrder => {
      const newOrder = [...prevOrder];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedItem);
      return newOrder;
    });
  };

  return {
    sectionOrder,
    moveSection,
  };
}
