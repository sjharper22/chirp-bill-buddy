
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LetterTemplate } from "@/types/template";

interface TemplateSelectorProps {
  isLoading: boolean;
  templates: LetterTemplate[] | undefined;
  selectedTemplateId: string | null;
  onTemplateChange: (value: string) => void;
}

export function TemplateSelector({ 
  isLoading, 
  templates, 
  selectedTemplateId, 
  onTemplateChange 
}: TemplateSelectorProps) {
  const { toast } = useToast();
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading templates...</span>
      </div>
    );
  }
  
  if (!templates?.length) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => {
          // Navigate to templates page would be implemented here
          toast({
            title: "Using default template",
            description: "No custom templates available.",
          });
        }}
      >
        Create Template
      </Button>
    );
  }
  
  return (
    <Select 
      value={selectedTemplateId || ''} 
      onValueChange={onTemplateChange}
    >
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select a template" />
      </SelectTrigger>
      <SelectContent>
        {templates.map((template) => (
          <SelectItem key={template.id} value={template.id}>
            {template.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
