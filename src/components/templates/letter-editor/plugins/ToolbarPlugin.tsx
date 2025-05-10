
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback } from 'react';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $createParagraphNode } from 'lexical';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { 
  Bold, 
  Italic, 
  Underline,
  ListOrdered, 
  ListChecks, 
  Heading1, 
  Heading2, 
  Heading3, 
  AlignLeft 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  
  const formatHeading = useCallback((headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  }, [editor]);
  
  const formatParagraph = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  }, [editor]);

  return (
    <div className="border-b p-1 bg-muted/30 flex flex-wrap items-center gap-1">
      <ToggleGroup type="multiple" className="flex flex-wrap">
        <ToggleGroupItem 
          value="bold" 
          size="sm" 
          aria-label="Toggle bold"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        >
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="italic" 
          size="sm" 
          aria-label="Toggle italic"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        >
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="underline" 
          size="sm" 
          aria-label="Toggle underline"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        >
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => formatParagraph()}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => formatHeading('h1')}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => formatHeading('h2')}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => formatHeading('h3')}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      >
        <ListChecks className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
}
