import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { adminGetAllSuperbillRequests, getMySuperbillRequests, SuperbillRequest, updateSuperbillRequestStatus, RequestStatus } from "@/services/superbillRequestService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const statusColors: Record<RequestStatus, string> = {
  pending: "bg-yellow-500/15 text-yellow-900 dark:text-yellow-200",
  in_progress: "bg-blue-500/15 text-blue-900 dark:text-blue-200",
  completed: "bg-green-500/15 text-green-900 dark:text-green-200",
  rejected: "bg-red-500/15 text-red-900 dark:text-red-200",
};

export default function Requests() {
  const { isAdmin, isEditor } = useAuth();
  const { toast } = useToast();
  const canManage = isAdmin || isEditor;
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<SuperbillRequest[]>([]);

  useEffect(() => {
    document.title = "Superbill Requests – Admin";
    const desc = "Manage patient superbill requests: view, update status, and fulfill.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = canManage ? await adminGetAllSuperbillRequests() : await getMySuperbillRequests();
        setRequests(data);
      } catch (err: any) {
        toast({ title: "Failed to load requests", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [canManage, toast]);

  const onChangeStatus = async (id: string, status: RequestStatus) => {
    try {
      const updated = await updateSuperbillRequestStatus(id, status);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast({ title: "Status updated" });
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <main className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Superbill Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="min-w-[160px]">
                        <div className="font-medium">{r.patient_name || "—"}</div>
                        <div className="text-xs text-muted-foreground">DOB: {r.patient_dob || "—"}</div>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <div>{r.contact_email || "—"}</div>
                        <div className="text-xs text-muted-foreground">{r.contact_phone || ""}</div>
                      </TableCell>
                      <TableCell className="min-w-[160px]">
                        <div className="text-xs">From: {r.from_date || "—"}</div>
                        <div className="text-xs">To: {r.to_date || "—"}</div>
                      </TableCell>
                      <TableCell className="min-w-[280px] max-w-[400px]">
                        <div className="line-clamp-3 whitespace-pre-wrap">{r.notes || "—"}</div>
                      </TableCell>
                      <TableCell className="min-w-[160px]">
                        {canManage ? (
                          <Select value={r.status} onValueChange={(v) => onChangeStatus(r.id, v as RequestStatus)}>
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={statusColors[r.status]}>{r.status.replace("_", " ")}</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
