
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { LetterTemplateEditor } from "@/components/templates/LetterTemplateEditor";
import { PatientList } from "@/components/templates/PatientList";
import { TemplatesGrid } from "@/components/templates/TemplatesGrid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LetterBuilder() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientDocuments, setPatientDocuments] = useState<any[]>([]);

  // Fetch letter templates
  const { data: templates, isLoading, refetch } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('letter_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleCreateNewLetter = (template?: any) => {
    setSelectedLetterId(template?.id || null);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    refetch();
    if (selectedPatientId) {
      // Reload patient documents
      const allDocuments = JSON.parse(localStorage.getItem('patient_documents') || '[]');
      const filteredDocuments = allDocuments.filter((doc: any) => doc.patient_id === selectedPatientId);
      setPatientDocuments(filteredDocuments);
    }
  };

  const coverLetters = templates?.filter(t => t.category === 'cover_letter') || [];
  const appealLetters = templates?.filter(t => t.category === 'appeal_letter') || [];
  const generalTemplates = templates?.filter(t => t.category === 'general') || [];

  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Letter Builder</h1>
          <p className="text-muted-foreground">
            Create, edit, and send letters for insurance claims and appeals
          </p>
        </div>

        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Letter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Letter</DialogTitle>
            </DialogHeader>
            <LetterTemplateEditor onSave={handleEditorClose} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <PatientList
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
          />
        </div>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="cover_letters">
            <TabsList className="mb-4">
              <TabsTrigger value="cover_letters">Cover Letters</TabsTrigger>
              <TabsTrigger value="appeal_letters">Appeal Letters</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              {selectedPatientId && <TabsTrigger value="patient_documents">Patient Documents</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="cover_letters">
              <TemplatesGrid
                templates={coverLetters}
                isLoading={isLoading}
                templateType="Cover Letter"
                onCreateNew={handleCreateNewLetter}
                onEditTemplate={handleCreateNewLetter}
              />
            </TabsContent>
            
            <TabsContent value="appeal_letters">
              <TemplatesGrid
                templates={appealLetters}
                isLoading={isLoading}
                templateType="Appeal Letter"
                onCreateNew={handleCreateNewLetter}
                onEditTemplate={handleCreateNewLetter}
              />
            </TabsContent>
            
            <TabsContent value="general">
              <TemplatesGrid
                templates={generalTemplates}
                isLoading={isLoading}
                templateType="Template"
                onCreateNew={handleCreateNewLetter}
                onEditTemplate={handleCreateNewLetter}
              />
            </TabsContent>
            
            {selectedPatientId && (
              <TabsContent value="patient_documents">
                <TemplatesGrid
                  templates={patientDocuments}
                  isLoading={false}
                  templateType="Document"
                  onCreateNew={handleCreateNewLetter}
                  onEditTemplate={handleCreateNewLetter}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
