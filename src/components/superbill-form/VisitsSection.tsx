
import { useState } from "react";
import { Visit, Superbill } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { VisitEntry } from "@/components/VisitEntry";
import { Plus, Save } from "lucide-react";
import { formatCurrency } from "@/lib/utils/superbill-utils";
import { VisitFilters } from "@/components/visit/VisitFilters";

interface VisitsSectionProps {
  superbill: Omit<Superbill, "id" | "createdAt" | "updatedAt">;
  updateVisit: (updatedVisit: Visit) => void;
  addVisit: () => void;
  duplicateVisit: (visit: Visit) => void;
  deleteVisit: (id: string) => void;
  totalFee: number;
  isEdit: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function VisitsSection({ 
  superbill, 
  updateVisit, 
  addVisit, 
  duplicateVisit, 
  deleteVisit,
  totalFee,
  isEdit,
  onSubmit
}: VisitsSectionProps) {
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>(superbill.visits);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visit Entries</CardTitle>
        <CardDescription>
          Add and manage visit information for this superbill
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {superbill.visits.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No visits added yet.</p>
            <Button 
              type="button"
              onClick={addVisit}
              className="mt-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Visit
            </Button>
          </div>
        ) : (
          <div>
            <VisitFilters 
              visits={superbill.visits}
              onFilteredVisitsChange={setFilteredVisits}
            />
            
            {filteredVisits.map(visit => (
              <VisitEntry
                key={visit.id}
                visit={visit}
                onVisitChange={updateVisit}
                onDuplicate={duplicateVisit}
                onDelete={deleteVisit}
                defaultMainComplaints={superbill.defaultMainComplaints}
              />
            ))}
            
            <div className="flex justify-between items-center mt-4">
              <Button 
                type="button"
                onClick={addVisit}
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Visit
              </Button>
              
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Fee:</p>
                <p className="text-xl font-bold">{formatCurrency(totalFee)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6 mt-4">
        <Button className="ml-auto" type="submit">
          <Save className="mr-2 h-4 w-4" />
          {isEdit ? "Update Superbill" : "Save Superbill"}
        </Button>
      </CardFooter>
    </Card>
  );
}
