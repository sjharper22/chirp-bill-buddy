
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Preview } from "@/components/preview/Preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Superbill } from "@/types/superbill";
import { formatDate, formatCurrency } from "@/lib/utils/superbill-utils";

interface GroupTableProps {
  filteredPatients: PatientWithSuperbills[];
  selectedPatientIds: string[];
  togglePatientSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
}

export function GroupTable({
  filteredPatients,
  selectedPatientIds,
  togglePatientSelection,
  clearSelection,
  selectAll
}: GroupTableProps) {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewSuperbill, setPreviewSuperbill] = useState<Superbill | null>(null);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Complete":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
      case "Missing Info":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">{status}</Badge>;
      case "Draft":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{status}</Badge>;
      case "No Superbill":
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };

  if (filteredPatients.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <p className="text-lg font-medium mb-2">No patients found</p>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search or filters
        </p>
        <Button onClick={() => navigate("/patients")}>
          Manage Patients
        </Button>
      </div>
    );
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
              <TableCell>{renderStatusBadge(patient.status)}</TableCell>
              <TableCell className="text-right">
                {patient.superbills.length > 0 ? (
                  <div className="flex justify-end gap-2">
                    <Dialog open={dialogOpen && previewSuperbill?.patientName === patient.name} onOpenChange={(open) => {
                      setDialogOpen(open);
                      if (!open) setPreviewSuperbill(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setPreviewSuperbill(patient.superbills[0]);
                            setDialogOpen(true);
                          }}
                        >
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Superbill Preview</DialogTitle>
                        </DialogHeader>
                        {previewSuperbill && (
                          <Preview superbill={previewSuperbill} />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/edit/${patient.superbills[0].id}`)}
                    >
                      Edit
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => {
                      navigate("/new", { state: { patientId: patient.id } });
                    }}
                  >
                    Create Superbill
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
