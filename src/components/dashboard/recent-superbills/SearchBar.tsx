
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchBarProps } from "./types";

export function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  expandSearch, 
  setExpandSearch 
}: SearchBarProps) {
  return (
    <div className={`relative transition-all ${expandSearch ? 'w-full sm:w-64' : 'w-10'}`}>
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer z-10" 
        onClick={() => setExpandSearch(true)}
      />
      <Input
        placeholder="Search superbills..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        onFocus={() => setExpandSearch(true)}
        onBlur={() => searchTerm === '' && setExpandSearch(false)}
        className={`transition-all pl-10 ${expandSearch ? 'opacity-100 w-full' : 'opacity-0 w-0 p-0 -ml-10 sm:ml-0'}`}
      />
    </div>
  );
}
