
import { Visit } from "@/types/superbill";
import { formatCurrency } from "@/lib/utils/superbill-utils";
import { Card, CardContent } from "@/components/ui/card";

interface VisitSummaryProps {
  visits: Visit[];
}

export function VisitSummary({ visits }: VisitSummaryProps) {
  // Calculate total visits
  const totalVisits = visits.length;
  
  // Calculate total charges
  const totalCharges = visits.reduce((total, visit) => total + visit.fee, 0);
  
  // Calculate average visit cost
  const averageVisitCost = totalVisits > 0 ? totalCharges / totalVisits : 0;
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">Summary of Visits</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Visits</p>
            <p className="text-2xl font-bold">{totalVisits}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Charges</p>
            <p className="text-2xl font-bold">{formatCurrency(totalCharges)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Visit Cost</p>
            <p className="text-2xl font-bold">{formatCurrency(averageVisitCost)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
