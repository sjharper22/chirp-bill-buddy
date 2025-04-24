
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { PatientList } from "@/components/templates/PatientList";
import { LetterBuilderHeader } from "@/components/letter-builder/LetterBuilderHeader";
import { LetterBuilderTabs } from "@/components/letter-builder/LetterBuilderTabs";

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
      <LetterBuilderHeader
        isEditorOpen={isEditorOpen}
        setIsEditorOpen={setIsEditorOpen}
        onEditorClose={handleEditorClose}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <PatientList
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
          />
        </div>
        
        <div className="md:col-span-3">
          <LetterBuilderTabs
            coverLetters={coverLetters}
            appealLetters={appealLetters}
            generalTemplates={generalTemplates}
            patientDocuments={patientDocuments}
            isLoading={isLoading}
            selectedPatientId={selectedPatientId}
            onCreateNew={handleCreateNewLetter}
            onEditTemplate={handleCreateNewLetter}
          />
        </div>
      </div>
    </div>
  );
}
