
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Superbill } from "@/types/superbill";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bold, Italic, List, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  generateOptionsFromSuperbill, 
  generateCoverLetter,
  CoverLetterOptions 
} from "@/lib/utils/cover-letter-generator";

interface CoverLetterEditorProps {
  superbill: Superbill;
  content?: string;
  onContentChange: (content: string) => void;
}

export function CoverLetterEditor({ superbill, content, onContentChange }: CoverLetterEditorProps) {
  const { toast } = useToast();
  const [editorContent, setEditorContent] = useState(content || "");
  const [isEditing, setIsEditing] = useState(false);
  const [includeInvoiceNote, setIncludeInvoiceNote] = useState(true);
  const [options, setOptions] = useState<CoverLetterOptions | null>(null);

  useEffect(() => {
    // Generate options from superbill
    if (superbill) {
      const newOptions = generateOptionsFromSuperbill(superbill, includeInvoiceNote);
      setOptions(newOptions);
      
      // Only set default content if no existing content
      if (!content) {
        const generatedContent = generateCoverLetter(newOptions);
        setEditorContent(generatedContent);
        onContentChange(generatedContent);
      }
    }
  }, [superbill, includeInvoiceNote]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorContent(e.target.value);
    onContentChange(e.target.value);
  };

  const handleRegenerateContent = () => {
    if (options) {
      const newContent = generateCoverLetter({
        ...options,
        includeInvoiceNote
      });
      setEditorContent(newContent);
      onContentChange(newContent);
      toast({ 
        title: "Cover Letter Regenerated",
        description: "The cover letter content has been updated."
      });
    }
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const formatText = (format: 'bold' | 'italic' | 'list') => {
    // Simple text formatting
    const textarea = document.querySelector('#cover-letter-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    let replacement = selectedText;
    
    switch (format) {
      case 'bold':
        replacement = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selectedText}</em>`;
        break;
      case 'list':
        replacement = `<ul>\n  <li>${selectedText.replace(/\n/g, '</li>\n  <li>')}</li>\n</ul>`;
        break;
    }
    
    const newContent = editorContent.substring(0, start) + replacement + editorContent.substring(end);
    setEditorContent(newContent);
    onContentChange(newContent);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <h3 className="text-lg font-semibold">Cover Letter</h3>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="invoice-note"
            checked={includeInvoiceNote}
            onCheckedChange={() => {
              setIncludeInvoiceNote(!includeInvoiceNote);
            }}
          />
          <Label htmlFor="invoice-note">Include invoice note</Label>
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 bg-muted p-2 rounded-t-md">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => formatText('bold')}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => formatText('italic')}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => formatText('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Textarea
            id="cover-letter-editor"
            value={editorContent}
            onChange={handleContentChange}
            className="min-h-[300px] font-mono text-sm"
          />
        </div>
      ) : (
        <div 
          className="border rounded-md p-4 min-h-[300px] overflow-auto"
          dangerouslySetInnerHTML={{ __html: editorContent }}
        />
      )}
      
      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={handleRegenerateContent}
        >
          Regenerate
        </Button>
        <Button 
          variant="outline" 
          onClick={toggleEdit}
        >
          {isEditing ? "Preview" : "Edit"}
        </Button>
      </div>
    </div>
  );
}
