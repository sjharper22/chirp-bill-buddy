
import { useState, useEffect } from "react";
import { Visit } from "@/services/visitService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils/superbill-utils";

interface VisitPickerProps {
  visits: Visit[];
  selectedVisitIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function VisitPicker({ 
  visits, 
  selectedVisitIds, 
  onSelectionChange, 
  onConfirm, 
  onCancel 
}: VisitPickerProps) {
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedVisitIds);

  useEffect(() => {
    setLocalSelectedIds(selectedVisitIds);
  }, [selectedVisitIds]);

  const handleVisitToggle = (visitId: string, checked: boolean) => {
    const newSelection = checked 
      ? [...localSelectedIds, visitId]
      : localSelectedIds.filter(id => id !== visitId);
    
    setLocalSelectedIds(newSelection);
    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    const allIds = visits.map(v => v.id);
    setLocalSelectedIds(allIds);
    onSelectionChange(allIds);
  };

  const clearAll = () => {
    setLocalSelectedIds([]);
    onSelectionChange([]);
  };

  const selectedVisits = visits.filter(v => localSelectedIds.includes(v.id));
  const totalFee = selectedVisits.reduce((sum, visit) => sum + (visit.fee || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select Visits for Superbill</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Summary */}
      {localSelectedIds.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {localSelectedIds.length} visit{localSelectedIds.length !== 1 ? 's' : ''} selected
              </div>
              <div className="text-lg font-semibold">
                Total: ${totalFee.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visit List */}
      <div className="space-y-3">
        {visits.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium mb-2">No unbilled visits found</h4>
              <p className="text-muted-foreground">
                This patient doesn't have any unbilled visits to include in a superbill.
              </p>
            </CardContent>
          </Card>
        ) : (
          visits.map((visit) => (
            <Card key={visit.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={localSelectedIds.includes(visit.id)}
                    onCheckedChange={(checked) => 
                      handleVisitToggle(visit.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatDate(new Date(visit.visit_date))}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {visit.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">${(visit.fee || 0).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      {visit.icd_codes && Array.isArray(visit.icd_codes) && visit.icd_codes.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">ICD:</span> {visit.icd_codes.join(", ")}
                        </div>
                      )}
                      {visit.cpt_codes && Array.isArray(visit.cpt_codes) && visit.cpt_codes.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">CPT:</span> {visit.cpt_codes.join(", ")}
                        </div>
                      )}
                      {visit.main_complaints && Array.isArray(visit.main_complaints) && visit.main_complaints.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Complaints:</span> {visit.main_complaints.join(", ")}
                        </div>
                      )}
                      {visit.notes && (
                        <div>
                          <span className="text-muted-foreground">Notes:</span> {visit.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button 
          onClick={onConfirm} 
          disabled={localSelectedIds.length === 0}
          className="flex-1"
        >
          Create Superbill with {localSelectedIds.length} Visit{localSelectedIds.length !== 1 ? 's' : ''}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
