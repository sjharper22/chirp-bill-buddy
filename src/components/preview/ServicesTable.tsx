
import { Visit } from "@/types/superbill";
import { formatCurrency, formatDate, calculateTotalFee } from "@/lib/utils/superbill-utils";

interface ServicesTableProps {
  visits: Visit[];
}

export function ServicesTable({ visits }: ServicesTableProps) {
  const totalFee = calculateTotalFee(visits);
  
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Services</h3>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="py-2 px-3 text-left">Date</th>
              <th className="py-2 px-3 text-left">ICD-10 Codes</th>
              <th className="py-2 px-3 text-left">CPT Codes</th>
              <th className="py-2 px-3 text-right">Fee</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit, index) => (
              <tr key={visit.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                <td className="py-2 px-3">{formatDate(visit.date)}</td>
                <td className="py-2 px-3">{visit.icdCodes.join(", ")}</td>
                <td className="py-2 px-3">{visit.cptCodes.join(", ")}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(visit.fee)}</td>
              </tr>
            ))}
            <tr className="border-t">
              <td colSpan={3} className="py-2 px-3 text-right font-bold">Total:</td>
              <td className="py-2 px-3 text-right font-bold">{formatCurrency(totalFee)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
