
import { Visit } from "@/types/superbill";
import { formatCurrency, formatDate, calculateTotalFee } from "@/lib/utils/superbill-utils";
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";

interface ServicesTableProps {
  visits: Visit[];
}

export function ServicesTable({ visits }: ServicesTableProps) {
  const totalFee = calculateTotalFee(visits);
  
  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'draft':
      default: return 'info';
    }
  };

  const statusLabel = {
    'draft': 'draft',
    'in_progress': 'in progress',
    'completed': 'completed'
  };

  // Create rows for each CPT code entry
  const serviceRows: Array<{
    visitId: string;
    date: Date;
    status?: string;
    cptCode: string;
    description: string;
    fee: number;
    isFirstRowForVisit: boolean;
    visitRowSpan: number;
  }> = [];

  visits.forEach(visit => {
    const cptEntries = visit.cptCodeEntries || [];
    
    // If no itemized entries, fall back to legacy cptCodes
    if (cptEntries.length === 0 && visit.cptCodes && visit.cptCodes.length > 0) {
      const feePerCode = visit.fee / visit.cptCodes.length;
      visit.cptCodes.forEach((code, index) => {
        serviceRows.push({
          visitId: visit.id,
          date: visit.date,
          status: visit.status,
          cptCode: code,
          description: 'Service rendered',
          fee: feePerCode,
          isFirstRowForVisit: index === 0,
          visitRowSpan: visit.cptCodes.length
        });
      });
    } else {
      // Use itemized entries
      cptEntries.forEach((entry, index) => {
        serviceRows.push({
          visitId: visit.id,
          date: visit.date,
          status: visit.status,
          cptCode: entry.code,
          description: entry.description,
          fee: entry.fee,
          isFirstRowForVisit: index === 0,
          visitRowSpan: cptEntries.length
        });
      });
    }
  });

  // Group by visit for subtotals
  const visitSubtotals = visits.map(visit => {
    const visitTotal = visit.cptCodeEntries?.reduce((sum, entry) => sum + entry.fee, 0) || visit.fee || 0;
    return { visitId: visit.id, total: visitTotal };
  });
  
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Services Rendered</h3>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="py-2 px-3 text-left">Date</th>
              <th className="py-2 px-3 text-left">Status</th>
              <th className="py-2 px-3 text-left">CPT Code</th>
              <th className="py-2 px-3 text-left">Description</th>
              <th className="py-2 px-3 text-right">Fee</th>
            </tr>
          </thead>
          <tbody>
            {serviceRows.map((row, index) => {
              const isLastRowForVisit = index === serviceRows.length - 1 || 
                serviceRows[index + 1]?.visitId !== row.visitId;
              
              return (
                <>
                  <tr key={`${row.visitId}-${index}`} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    {row.isFirstRowForVisit && (
                      <>
                        <td className="py-2 px-3 border-r" rowSpan={row.visitRowSpan}>
                          {formatDate(row.date)}
                        </td>
                        <td className="py-2 px-3 border-r" rowSpan={row.visitRowSpan}>
                          <StatusBadge 
                            status={statusLabel[row.status || 'draft']} 
                            variant={getStatusVariant(row.status)}
                          />
                        </td>
                      </>
                    )}
                    <td className="py-2 px-3 font-mono text-sm">{row.cptCode}</td>
                    <td className="py-2 px-3">{row.description}</td>
                    <td className="py-2 px-3 text-right">{formatCurrency(row.fee)}</td>
                  </tr>
                  
                  {isLastRowForVisit && (
                    <tr className="bg-muted/20 border-b-2">
                      <td colSpan={3}></td>
                      <td className="py-1 px-3 text-right text-sm font-semibold">Visit Subtotal:</td>
                      <td className="py-1 px-3 text-right text-sm font-semibold">
                        {formatCurrency(visitSubtotals.find(v => v.visitId === row.visitId)?.total || 0)}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            
            <tr className="border-t-2 bg-primary/5">
              <td colSpan={4} className="py-3 px-3 text-right font-bold text-lg">Grand Total:</td>
              <td className="py-3 px-3 text-right font-bold text-lg">{formatCurrency(totalFee)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
