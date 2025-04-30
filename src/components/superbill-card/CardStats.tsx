
import { formatCurrency } from "@/lib/utils/superbill-utils";
import { CardStatsProps } from "./types";

export function CardStats({ visitCount, totalFee }: CardStatsProps) {
  return (
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Visits</p>
        <p className="font-medium">{visitCount}</p>
      </div>
      
      <div className="text-right">
        <p className="text-sm text-muted-foreground">Total</p>
        <p className="font-bold">{formatCurrency(totalFee)}</p>
      </div>
    </div>
  );
}
