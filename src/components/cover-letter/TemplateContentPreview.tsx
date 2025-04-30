
import { Card } from "@/components/ui/card";

interface TemplateContentPreviewProps {
  processedContent: string;
}

export function TemplateContentPreview({ processedContent }: TemplateContentPreviewProps) {
  if (!processedContent) {
    return null;
  }
  
  return (
    <Card className="p-4">
      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: processedContent.replace(/\n/g, '<br />') }} />
      </div>
    </Card>
  );
}
