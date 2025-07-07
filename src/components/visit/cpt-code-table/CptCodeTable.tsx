import { CptCodeEntry } from "@/types/cpt-entry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/superbill-utils";

interface CptCodeTableProps {
  entries: CptCodeEntry[];
  onUpdateEntry: (index: number, updates: Partial<CptCodeEntry>) => void;
  onRemoveEntry: (index: number) => void;
}

export function CptCodeTable({ entries, onUpdateEntry, onRemoveEntry }: CptCodeTableProps) {
  const totalFee = entries.reduce((sum, entry) => sum + entry.fee, 0);

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No CPT codes added yet.</p>
        <p className="text-sm">Click "Add CPT Code" to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CPT Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-32">Fee</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  value={entry.code}
                  onChange={(e) => onUpdateEntry(index, { code: e.target.value.toUpperCase() })}
                  className="w-24"
                  placeholder="CPT"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={entry.description}
                  onChange={(e) => onUpdateEntry(index, { description: e.target.value })}
                  placeholder="Procedure description"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={entry.fee}
                  onChange={(e) => onUpdateEntry(index, { fee: parseFloat(e.target.value) || 0 })}
                  className="w-28"
                  placeholder="0.00"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveEntry(index)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="border-t-2">
            <TableCell colSpan={2} className="text-right font-semibold">
              Visit Total:
            </TableCell>
            <TableCell className="font-bold">
              {formatCurrency(totalFee)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}