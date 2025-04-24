
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplatesGrid } from "@/components/templates/TemplatesGrid";

interface LetterBuilderTabsProps {
  coverLetters: any[];
  appealLetters: any[];
  generalTemplates: any[];
  patientDocuments: any[];
  isLoading: boolean;
  selectedPatientId: string | null;
  onCreateNew: () => void;
  onEditTemplate: (template: any) => void;
}

export function LetterBuilderTabs({
  coverLetters,
  appealLetters,
  generalTemplates,
  patientDocuments,
  isLoading,
  selectedPatientId,
  onCreateNew,
  onEditTemplate,
}: LetterBuilderTabsProps) {
  return (
    <Tabs defaultValue="cover_letters">
      <TabsList className="mb-4">
        <TabsTrigger value="cover_letters">Cover Letters</TabsTrigger>
        <TabsTrigger value="appeal_letters">Appeal Letters</TabsTrigger>
        <TabsTrigger value="general">General</TabsTrigger>
        {selectedPatientId && (
          <TabsTrigger value="patient_documents">Patient Documents</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="cover_letters">
        <TemplatesGrid
          templates={coverLetters}
          isLoading={isLoading}
          templateType="Cover Letter"
          onCreateNew={onCreateNew}
          onEditTemplate={onEditTemplate}
        />
      </TabsContent>
      
      <TabsContent value="appeal_letters">
        <TemplatesGrid
          templates={appealLetters}
          isLoading={isLoading}
          templateType="Appeal Letter"
          onCreateNew={onCreateNew}
          onEditTemplate={onEditTemplate}
        />
      </TabsContent>
      
      <TabsContent value="general">
        <TemplatesGrid
          templates={generalTemplates}
          isLoading={isLoading}
          templateType="Template"
          onCreateNew={onCreateNew}
          onEditTemplate={onEditTemplate}
        />
      </TabsContent>
      
      {selectedPatientId && (
        <TabsContent value="patient_documents">
          <TemplatesGrid
            templates={patientDocuments}
            isLoading={false}
            templateType="Document"
            onCreateNew={onCreateNew}
            onEditTemplate={onEditTemplate}
          />
        </TabsContent>
      )}
    </Tabs>
  );
}
