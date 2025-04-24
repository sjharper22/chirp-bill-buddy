
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TemplateHeaderControlsProps {
  title: string;
  setTitle: (title: string) => void;
  category: "cover_letter" | "appeal_letter" | "general";
  setCategory: (category: "cover_letter" | "appeal_letter" | "general") => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  selectedSuperbillId: string;
  setSelectedSuperbillId: (id: string) => void;
  templates: any[];
  patients: any[];
  superbills: any[];
}

export function TemplateHeaderControls({
  title,
  setTitle,
  category,
  setCategory,
  selectedTemplateId,
  setSelectedTemplateId,
  selectedPatientId,
  setSelectedPatientId,
  selectedSuperbillId,
  setSelectedSuperbillId,
  templates,
  patients,
  superbills,
}: TemplateHeaderControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Template Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Select 
          value={category} 
          onValueChange={(value: "cover_letter" | "appeal_letter" | "general") => setCategory(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover_letter">Cover Letter</SelectItem>
            <SelectItem value="appeal_letter">Appeal Letter</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
          <SelectTrigger>
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">New Template</SelectItem>
            {templates?.map(template => (
              <SelectItem key={template.id} value={template.id}>
                {template.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
          <SelectTrigger>
            <SelectValue placeholder="Select patient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No Patient</SelectItem>
            {patients.map(patient => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedPatientId && (
          <Select value={selectedSuperbillId} onValueChange={setSelectedSuperbillId}>
            <SelectTrigger>
              <SelectValue placeholder="Select superbill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Superbill</SelectItem>
              {superbills
                .filter(sb => {
                  const patient = patients.find(p => p.id === selectedPatientId);
                  return patient && sb.patientName === patient.name;
                })
                .map(superbill => (
                  <SelectItem key={superbill.id} value={superbill.id}>
                    {new Date(superbill.issueDate).toLocaleDateString()} ({superbill.visits.length} visits)
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
