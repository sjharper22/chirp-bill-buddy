
import React from 'react';
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface TemplateEditorProps {
  content: string;
  setContent: (content: string) => void;
}

export function TemplateEditor({ content, setContent }: TemplateEditorProps) {
  return (
    <Card className="p-4">
      <Textarea
        className="w-full min-h-[400px] p-4 font-mono text-sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your template..."
      />
    </Card>
  );
}
