
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { LetterTemplateEditor } from "@/components/templates/LetterTemplateEditor";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, FileEdit, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { usePatient } from "@/context/patient-context";

// Document interface to match our data structure
interface PatientDocument {
  id: string;
  patient_id: string;
  document_type: string;
  title: string;
  content: { text: string } | string;
  created_by: string;
  created_at: string;
}

export default function LetterBuilder() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const { patients } = usePatient();
  const [patientDocuments, setPatientDocuments] = useState<PatientDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

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

  // Get patient documents from localStorage
  useEffect(() => {
    if (selectedPatientId) {
      setIsLoadingDocuments(true);
      try {
        // Get documents from localStorage
        const allDocuments: PatientDocument[] = JSON.parse(localStorage.getItem('patient_documents') || '[]');
        const filteredDocuments = allDocuments.filter(doc => doc.patient_id === selectedPatientId);
        setPatientDocuments(filteredDocuments);
      } catch (error) {
        console.error("Error loading patient documents:", error);
        setPatientDocuments([]);
      } finally {
        setIsLoadingDocuments(false);
      }
    } else {
      setPatientDocuments([]);
    }
  }, [selectedPatientId]);

  const refetchDocuments = () => {
    if (selectedPatientId) {
      try {
        const allDocuments: PatientDocument[] = JSON.parse(localStorage.getItem('patient_documents') || '[]');
        const filteredDocuments = allDocuments.filter(doc => doc.patient_id === selectedPatientId);
        setPatientDocuments(filteredDocuments);
      } catch (error) {
        console.error("Error reloading patient documents:", error);
      }
    }
  };

  const coverLetters = templates?.filter(t => t.category === 'cover_letter') || [];
  const appealLetters = templates?.filter(t => t.category === 'appeal_letter') || [];
  const generalTemplates = templates?.filter(t => t.category === 'general') || [];

  const handleCreateNewLetter = (template?: any) => {
    setSelectedLetterId(template?.id || null);
    setIsEditorOpen(true);
  };

  // Helper function to get content text safely
  const getContentText = (content: any): string => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    if (typeof content === 'object' && content !== null && 'text' in content) {
      return content.text as string;
    }
    return JSON.stringify(content);
  };

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
            <LetterTemplateEditor 
              onSave={() => {
                setIsEditorOpen(false);
                refetch();
                if (selectedPatientId) {
                  refetchDocuments();
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Patients</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {patients.map(patient => (
                <div 
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`p-2 rounded-md cursor-pointer ${selectedPatientId === patient.id ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                >
                  {patient.name}
                </div>
              ))}
              {patients.length === 0 && (
                <p className="text-muted-foreground text-sm">No patients found</p>
              )}
            </div>
          </div>
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
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coverLetters.length === 0 ? (
                    <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-lg font-medium mt-4 mb-2">No cover letters yet</p>
                      <p className="text-muted-foreground mb-6">
                        Create your first cover letter template
                      </p>
                      <Button onClick={() => handleCreateNewLetter()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Cover Letter
                      </Button>
                    </div>
                  ) : (
                    coverLetters.map(template => (
                      <Card key={template.id}>
                        <CardHeader>
                          <CardTitle>{template.title}</CardTitle>
                          <CardDescription>
                            Cover Letter {template.is_default && "• Default"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground truncate">
                            {getContentText(template.content).substring(0, 100)}...
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCreateNewLetter(template)}
                          >
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button size="sm" onClick={() => handleCreateNewLetter(template)}>
                            Use
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="appeal_letters">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appealLetters.length === 0 ? (
                    <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-lg font-medium mt-4 mb-2">No appeal letters yet</p>
                      <p className="text-muted-foreground mb-6">
                        Create your first appeal letter template
                      </p>
                      <Button onClick={() => handleCreateNewLetter()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Appeal Letter
                      </Button>
                    </div>
                  ) : (
                    appealLetters.map(template => (
                      <Card key={template.id}>
                        <CardHeader>
                          <CardTitle>{template.title}</CardTitle>
                          <CardDescription>
                            Appeal Letter {template.is_default && "• Default"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground truncate">
                            {getContentText(template.content).substring(0, 100)}...
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCreateNewLetter(template)}
                          >
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button size="sm" onClick={() => handleCreateNewLetter(template)}>
                            Use
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="general">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generalTemplates.length === 0 ? (
                    <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-lg font-medium mt-4 mb-2">No general templates yet</p>
                      <p className="text-muted-foreground mb-6">
                        Create your first general document template
                      </p>
                      <Button onClick={() => handleCreateNewLetter()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Template
                      </Button>
                    </div>
                  ) : (
                    generalTemplates.map(template => (
                      <Card key={template.id}>
                        <CardHeader>
                          <CardTitle>{template.title}</CardTitle>
                          <CardDescription>
                            General Template {template.is_default && "• Default"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground truncate">
                            {getContentText(template.content).substring(0, 100)}...
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCreateNewLetter(template)}
                          >
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button size="sm" onClick={() => handleCreateNewLetter(template)}>
                            Use
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </TabsContent>
            
            {selectedPatientId && (
              <TabsContent value="patient_documents">
                {isLoadingDocuments ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {!patientDocuments || patientDocuments.length === 0 ? (
                      <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-lg font-medium mt-4 mb-2">No documents for this patient</p>
                        <p className="text-muted-foreground mb-6">
                          Create a new letter for this patient
                        </p>
                        <Button onClick={() => handleCreateNewLetter()}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Letter
                        </Button>
                      </div>
                    ) : (
                      patientDocuments.map(doc => (
                        <Card key={doc.id}>
                          <CardHeader>
                            <CardTitle>{doc.title}</CardTitle>
                            <CardDescription>
                              {doc.document_type} • {new Date(doc.created_at).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground truncate">
                              {getContentText(doc.content).substring(0, 100)}...
                            </p>
                          </CardContent>
                          <CardFooter className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCreateNewLetter({
                                id: null,
                                title: doc.title,
                                content: doc.content,
                                category: doc.document_type
                              })}
                            >
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
