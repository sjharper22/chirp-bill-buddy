
import { useState } from "react";

export function useFilterSearch() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  return {
    filterStatus,
    setFilterStatus,
    searchTerm,
    setSearchTerm
  };
}
