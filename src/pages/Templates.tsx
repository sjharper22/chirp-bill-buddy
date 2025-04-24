
import React from 'react';
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
import { Loader2, Plus } from "lucide-react";

export default function Templates() {
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);

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

  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Letter Templates</h1>
          <p className="text-muted-foreground">
            Create and manage your letter templates for cover letters and appeals
          </p>
        </div>

        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <LetterTemplateEditor 
              onSave={() => {
                setIsEditorOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : templates?.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-lg font-medium mb-2">No templates yet</p>
          <p className="text-muted-foreground mb-6">
            Create your first template to get started
          </p>
          <Button onClick={() => setIsEditorOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates?.map((template) => (
            <div
              key={template.id}
              className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
            >
              <h3 className="font-medium mb-2">{template.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {template.category.replace('_', ' ')}
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Use Template</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
