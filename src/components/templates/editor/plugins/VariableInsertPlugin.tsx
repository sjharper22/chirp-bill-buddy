
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTextNode, $getSelection, $isRangeSelection } from 'lexical';
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VariableInsertPluginProps {
  variables: Array<{ label: string; variable: string }>;
}

export function VariableInsertPlugin({ variables }: VariableInsertPluginProps) {
  const [editor] = useLexicalComposerContext();
  
  const insertVariable = (variable: string) => {
    editor.update(() => {
      const selection = $getSelection();
      
      if ($isRangeSelection(selection)) {
        // Insert the variable wrapped in double curly braces as plain text
        const variableText = `{{${variable}}}`;
        selection.insertNodes([$createTextNode(variableText)]);
      }
    });
  };

  if (variables.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-1" />
            Insert Variable
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <h4 className="font-medium mb-2">Available Variables</h4>
          <ScrollArea className="h-48">
            <div className="space-y-2 p-1">
              {variables.map((item) => (
                <Badge
                  key={item.variable}
                  variant="outline"
                  className="cursor-pointer p-1.5 text-sm hover:bg-primary/10"
                  onClick={() => {
                    insertVariable(item.variable);
                  }}
                >
                  {item.label}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
