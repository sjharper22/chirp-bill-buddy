
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantRequest {
  type: 'visit_notes' | 'code_suggestions' | 'cover_letter_enhancement' | 'patient_communication';
  prompt: string;
  context?: any;
  model?: 'openai' | 'claude';
}

interface AIAssistantResponse {
  success: boolean;
  content?: string;
  model?: string;
  error?: string;
}

export function useAIAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const callAIAssistant = async (request: AIAssistantRequest): Promise<string | null> => {
    setIsLoading(true);
    
    try {
      console.log('Calling AI assistant with request:', request.type);
      
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: request
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      const response = data as AIAssistantResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'AI assistant request failed');
      }

      console.log(`AI assistant response received from ${response.model}`);
      
      toast({
        title: "AI Assistant",
        description: `Content generated successfully using ${response.model}`,
      });

      return response.content || null;
      
    } catch (error) {
      console.error('AI assistant error:', error);
      toast({
        title: "AI Assistant Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generateVisitNotes = async (treatmentDescription: string, patientInfo?: any) => {
    return await callAIAssistant({
      type: 'visit_notes',
      prompt: `Generate professional visit notes for: ${treatmentDescription}`,
      context: patientInfo
    });
  };

  const suggestCodes = async (treatmentDescription: string, existingCodes?: string[]) => {
    return await callAIAssistant({
      type: 'code_suggestions',
      prompt: `Suggest appropriate ICD-10 and CPT codes for: ${treatmentDescription}`,
      context: { existingCodes }
    });
  };

  const enhanceCoverLetter = async (currentContent: string, patientInfo?: any) => {
    return await callAIAssistant({
      type: 'cover_letter_enhancement',
      prompt: `Enhance this cover letter for insurance submission: ${currentContent}`,
      context: patientInfo
    });
  };

  const generatePatientCommunication = async (purpose: string, patientInfo?: any) => {
    return await callAIAssistant({
      type: 'patient_communication',
      prompt: `Generate patient communication for: ${purpose}`,
      context: patientInfo
    });
  };

  return {
    isLoading,
    callAIAssistant,
    generateVisitNotes,
    suggestCodes,
    enhanceCoverLetter,
    generatePatientCommunication
  };
}
