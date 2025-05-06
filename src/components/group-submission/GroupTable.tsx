
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PatientWithSuperbills } from "./types";
import { formatDate, formatCurrency } from "@/lib/utils/superbill-utils";
import { EmptyState } from "./table/EmptyState";
import { StatusBadge } from "./table/StatusBadge";
import { TableActions } from "./table/TableActions";
import { PreviewDialog } from "./table/PreviewDialog";
import { Superbill, SuperbillStatus } from "@/types/superbill";

interface GroupTableProps {
  filteredPatients: PatientWithSuperbills[];
  selectedPatientIds: string[];
  togglePatientSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
  onStatusChange?: (id: string, newStatus: SuperbillStatus) => void; // Added onStatusChange prop
}

export function GroupTable({
  filteredPatients,
  selectedPatientIds,
  togglePatientSelection,
  clearSelection,
  selectAll,
  onStatusChange
}: GroupTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewSuperbill, setPreviewSuperbill] = useState<Superbill | null>(null);

  if (filteredPatients.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={filteredPatients.length > 0 && selectedPatientIds.length === filteredPatients.length}
                onCheckedChange={() => {
                  if (selectedPatientIds.length === filteredPatients.length) {
                    clearSelection();
                  } else {
                    selectAll();
                  }
                }}
              />
            </TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead>Visits</TableHead>
            <TableHead>Total Billed</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedPatientIds.includes(patient.id)}
                  onCheckedChange={() => togglePatientSelection(patient.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>
                {patient.dateRange ? (
                  `${formatDate(patient.dateRange.start)} - ${formatDate(patient.dateRange.end)}`
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>{patient.totalVisits}</TableCell>
              <TableCell>{formatCurrency(patient.totalAmount)}</TableCell>
              <TableCell>
                <StatusBadge status={patient.status} />
              </TableCell>
              <TableCell className="text-right">
                <Dialog 
                  open={dialogOpen && previewSuperbill?.patientName === patient.name} 
                  onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) setPreviewSuperbill(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <TableActions
                      superbills={patient.superbills}
                      patientId={patient.id}
                      onPreview={(superbill) => {
                        setPreviewSuperbill(superbill);
                        setDialogOpen(true);
                      }}
                      onStatusChange={onStatusChange}
                    />
                  </DialogTrigger>
                  <PreviewDialog
                    open={dialogOpen}
                    content={previewSuperbill}
                    contentType="superbill"
                    onOpenChange={setDialogOpen}
                  />
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
