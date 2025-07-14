import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ComplaintsSelectorProps {
  selectedComplaints: string[];
  availableComplaints: { value: string; label: string }[];
  onComplaintsChange: (complaints: string[]) => void;
  label?: string;
  placeholder?: string;
}

export function ComplaintsSelector({
  selectedComplaints,
  availableComplaints,
  onComplaintsChange,
  label = "Complaints",
  placeholder = "Select complaints"
}: ComplaintsSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customComplaint, setCustomComplaint] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const filteredComplaints = availableComplaints.filter(complaint =>
    complaint.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleComplaintToggle = (complaint: string, checked: boolean) => {
    if (checked) {
      onComplaintsChange([...selectedComplaints, complaint]);
    } else {
      onComplaintsChange(selectedComplaints.filter(c => c !== complaint));
    }
  };

  const handleAddCustomComplaint = () => {
    if (customComplaint.trim() && !selectedComplaints.includes(customComplaint.trim())) {
      onComplaintsChange([...selectedComplaints, customComplaint.trim()]);
      setCustomComplaint("");
      setShowCustomInput(false);
    }
  };

  const handleRemoveComplaint = (complaint: string) => {
    onComplaintsChange(selectedComplaints.filter(c => c !== complaint));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomComplaint();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {/* Display Selected Complaints */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
        {selectedComplaints.length > 0 ? (
          selectedComplaints.map((complaint) => (
            <Badge key={complaint} variant="secondary" className="flex items-center gap-1">
              {complaint}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => handleRemoveComplaint(complaint)}
              />
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground text-sm">{placeholder}</span>
        )}
      </div>

      {/* Select Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Complaints
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Complaints</DialogTitle>
          </DialogHeader>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Complaints List */}
          <ScrollArea className="h-60">
            <div className="space-y-2">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={complaint.value}
                    checked={selectedComplaints.includes(complaint.value)}
                    onCheckedChange={(checked) => 
                      handleComplaintToggle(complaint.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={complaint.value} 
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {complaint.label}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Custom Complaint Input */}
          <div className="border-t pt-3">
            {!showCustomInput ? (
              <Button 
                variant="outline" 
                onClick={() => setShowCustomInput(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Complaint
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom complaint"
                  value={customComplaint}
                  onChange={(e) => setCustomComplaint(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
                <Button onClick={handleAddCustomComplaint} size="sm">
                  Add
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomComplaint("");
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}