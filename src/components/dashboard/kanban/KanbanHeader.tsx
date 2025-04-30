
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { KanbanHeaderProps } from "./types";

export function KanbanHeader({ searchTerm, onSearchChange }: KanbanHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-xl font-semibold">Superbills Board</h2>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search superbills..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-[250px]"
          />
        </div>
        <Button onClick={() => navigate("/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Superbill
        </Button>
      </div>
    </div>
  );
}
