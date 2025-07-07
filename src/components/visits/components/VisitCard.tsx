import { Visit } from "@/services/visitService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/superbill-utils";

interface VisitCardProps {
  visit: Visit;
  onEdit: (visit: Visit) => void;
  onDelete: (visitId: string) => void;
}

export function VisitCard({ visit, onEdit, onDelete }: VisitCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "unbilled": return "bg-yellow-100 text-yellow-800";
      case "billed": return "bg-green-100 text-green-800";
      case "included_in_superbill": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {formatDate(new Date(visit.visit_date))}
                </span>
              </div>
              <Badge className={getStatusColor(visit.status || "unbilled")}>
                {visit.status?.replace("_", " ") || "unbilled"}
              </Badge>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>${(visit.fee || 0).toFixed(2)}</span>
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
          
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(visit)}
              disabled={visit.status === "billed"}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(visit.id)}
              disabled={visit.status === "billed"}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}