
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface AIAssistantButtonProps {
  type: 'visit_notes' | 'code_suggestions' | 'cover_letter_enhancement' | 'patient_communication';
  onResult: (content: string) => void;
  context?: any;
  prompt?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  children?: React.ReactNode;
}

export function AIAssistantButton({
  type,
  onResult,
  context,
  prompt,
  variant = "outline",
  size = "sm",
  children
}: AIAssistantButtonProps) {
  const { isLoading, callAIAssistant } = useAIAssistant();
  const [isOpen, setIsOpen] = useState(false);

  const handleAIAssist = async (selectedModel: 'openai' | 'claude' = 'openai') => {
    if (!prompt) return;

    const result = await callAIAssistant({
      type,
      prompt,
      context,
      model: selectedModel
    });

    if (result) {
      onResult(result);
      setIsOpen(false);
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'visit_notes':
        return 'Generate Notes';
      case 'code_suggestions':
        return 'Suggest Codes';
      case 'cover_letter_enhancement':
        return 'Enhance Letter';
      case 'patient_communication':
        return 'AI Assist';
      default:
        return 'AI Assist';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          disabled={isLoading || !prompt}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {children || getButtonText()}
          <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
            AI
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="space-y-3">
          <div className="text-sm font-medium">Choose AI Model</div>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAIAssist('openai')}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              OpenAI (Fast & Reliable)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAIAssist('claude')}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Claude (Advanced Reasoning)
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
