
import { useState } from "react";
import { Superbill, SuperbillStatus } from "@/types/superbill";

export function useKanbanFiltering(
  superbills: Superbill[],
  searchTerm: string
) {
  const [statusFilter, setStatusFilter] = useState<SuperbillStatus | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Filter superbills based on search term and status filter
  const filteredSuperbills = superbills
    .filter(bill => 
      bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(bill => statusFilter === "all" ? true : bill.status === statusFilter)
    .sort((a, b) => {
      const dateA = a.issueDate ? new Date(a.issueDate).getTime() : 0;
      const dateB = b.issueDate ? new Date(b.issueDate).getTime() : 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const handleFilterChange = (status: SuperbillStatus | "all") => {
    setStatusFilter(status);
  };

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  return {
    statusFilter,
    sortOrder,
    filteredSuperbills,
    handleFilterChange,
    handleSortChange
  };
}
