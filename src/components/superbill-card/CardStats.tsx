
import { formatCurrency } from "@/lib/utils/superbill-utils";
import { CardStatsProps } from "./types";

export function CardStats({ visitCount, totalFee }: CardStatsProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-xs text-muted-foreground">Visits</p>
        <p className="font-medium">{visitCount}</p>
      </div>
      
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Total</p>
        <p className="font-bold text-sm">{formatCurrency(totalFee)}</p>
      </div>
    </div>
  );
}
