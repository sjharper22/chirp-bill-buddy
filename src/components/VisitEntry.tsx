
import { useState } from "react";
import { Visit } from "@/types/superbill";
import { duplicateVisit, formatCurrency } from "@/lib/utils/superbill-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Trash2 } from "lucide-react";
import { VisitDatePicker } from "@/components/visit/VisitDatePicker";
import { VisitComplaints } from "@/components/visit/VisitComplaints";
import { IcdCodeSelector } from "@/components/visit/IcdCodeSelector";
import { CptCodeSelector } from "@/components/visit/CptCodeSelector";
import { VisitNotes } from "@/components/visit/VisitNotes";

interface VisitEntryProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
  onDuplicate: (visit: Visit) => void;
  onDelete: (id: string) => void;
  defaultMainComplaints?: string[];
}

export function VisitEntry({ 
  visit, 
  onVisitChange, 
  onDuplicate, 
  onDelete,
  defaultMainComplaints = []
}: VisitEntryProps) {
  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onVisitChange({ ...visit, fee: value });
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    // Prevent default action to stop form submission behavior
    e.preventDefault();
    // Prevent any bubbling that might trigger navigation
    e.stopPropagation();
    
    onDuplicate(duplicateVisit(visit));
  };

  const handleDelete = (e: React.MouseEvent) => {
    // Prevent default action to stop form submission behavior
    e.preventDefault();
    // Prevent any bubbling that might trigger navigation
    e.stopPropagation();
    
    onDelete(visit.id);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4">
          {/* Visit Date */}
          <div className="w-full sm:w-auto">
            <VisitDatePicker 
              visit={visit} 
              onVisitChange={onVisitChange} 
            />
          </div>

          {/* Main Complaints */}
          <div className="w-full sm:flex-1">
            <VisitComplaints 
              visit={visit} 
              onVisitChange={onVisitChange} 
              defaultMainComplaints={defaultMainComplaints} 
            />
          </div>

          {/* Fee */}
          <div className="w-full sm:w-auto">
            <Input
              type="number"
              placeholder="Fee"
              value={visit.fee || ""}
              onChange={handleFeeChange}
              className="w-full sm:w-[120px]"
              min={0}
              step={0.01}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex ml-auto gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleDuplicate}
              title="Duplicate visit"
              type="button"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleDelete}
              title="Delete visit"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ICD-10 Codes */}
        <IcdCodeSelector visit={visit} onVisitChange={onVisitChange} />

        {/* CPT Codes */}
        <CptCodeSelector visit={visit} onVisitChange={onVisitChange} />

        {/* Notes */}
        <VisitNotes visit={visit} onVisitChange={onVisitChange} />
      </CardContent>
    </Card>
  );
}
