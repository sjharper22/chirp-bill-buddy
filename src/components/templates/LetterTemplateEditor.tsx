
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LetterTemplateEditorProps {
  patientData?: any;
  superbillData?: any;
  onSave?: () => void;
}

export function LetterTemplateEditor({ 
  patientData, 
  superbillData,
  onSave 
}: LetterTemplateEditorProps) {
  const { toast } = useToast();
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<"cover_letter" | "appeal_letter" | "general">("cover_letter");
  const [content, setContent] = React.useState("");

  const handleSaveTemplate = async () => {
    try {
      const { error } = await supabase
        .from('letter_templates')
        .insert({
          title,
          content: { text: content },
          category
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template saved successfully",
      });

      if (onSave) onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Template Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Select value={category} onValueChange={(value: any) => setCategory(value)}>
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

      <Card className="p-4">
        {/* Placeholder for Lexical Editor */}
        <textarea
          className="w-full min-h-[400px] p-4 rounded-md border"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your template..."
        />
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSaveTemplate}>Save Template</Button>
      </div>
    </div>
  );
}
