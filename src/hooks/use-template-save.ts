
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";

export function useTemplateSave() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [totalCharges, setTotalCharges] = useState<string>("0.00");

  const saveTemplate = async ({
    title,
    content,
    category,
    selectedPatientId,
    user,
  }: {
    title: string;
    content: string;
    category: "cover_letter" | "appeal_letter" | "general";
    selectedPatientId: string | null;
    user: any;
  }) => {
    try {
      if (!user) {
        throw new Error("You must be logged in to save templates");
      }

      const { error } = await supabase
        .from('letter_templates')
        .insert({
          title,
          content: { text: content },
          category,
          created_by: user.id,
          is_default: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template saved successfully",
      });

      if (selectedPatientId) {
        const existingDocuments = JSON.parse(localStorage.getItem('patient_documents') || '[]');
        
        existingDocuments.push({
          id: Math.random().toString(36).substring(2, 11),
          patient_id: selectedPatientId,
          document_type: category,
          title,
          content: { text: content },
          created_by: user.id,
          created_at: new Date().toISOString()
        });
        
        localStorage.setItem('patient_documents', JSON.stringify(existingDocuments));
        
        toast({
          title: "Success",
          description: "Document saved to patient record",
        });
      }

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return { saveTemplate, totalCharges, setTotalCharges };
}
