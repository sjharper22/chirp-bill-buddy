
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, DollarSign, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils/superbill-utils";

interface DashboardStatsProps {
  totalPatients: number;
  totalVisits: number;
  totalBilled: number;
  averageFee: number;
}

export function DashboardStats({ totalPatients, totalVisits, totalBilled, averageFee }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
            <p className="text-3xl font-bold">{totalPatients}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Visits</p>
            <p className="text-3xl font-bold">{totalVisits}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Billed</p>
            <p className="text-3xl font-bold">{formatCurrency(totalBilled)}</p>
          </div>
          <div className="p-3 bg-amber-100 rounded-full">
            <DollarSign className="h-6 w-6 text-amber-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Average Fee</p>
            <p className="text-3xl font-bold">{formatCurrency(averageFee)}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Activity className="h-6 w-6 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
