
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback } from 'react';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $createParagraphNode } from 'lexical';
import { $createQuoteNode } from '@lexical/rich-text';
import { 
  INSERT_ORDERED_LIST_COMMAND, 
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND
} from '@lexical/list';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRulePlugin';
import { 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
  ListOrdered, 
  ListChecks, 
  Heading1, 
  Heading2, 
  Heading3, 
  AlignLeft,
  Quote,
  ListCheck,
  SeparatorHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  
  const formatQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  }, [editor]);
  
  const insertHorizontalRule = useCallback(() => {
    editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
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
        <ToggleGroupItem 
          value="strikethrough" 
          size="sm" 
          aria-label="Toggle strikethrough"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        >
          <Strikethrough className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center">
            <AlignLeft className="h-4 w-4 mr-1" />
            <span>Block</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Block Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={formatParagraph}>
              <AlignLeft className="h-4 w-4 mr-2" />
              Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatHeading('h1')}>
              <Heading1 className="h-4 w-4 mr-2" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatHeading('h2')}>
              <Heading2 className="h-4 w-4 mr-2" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatHeading('h3')}>
              <Heading3 className="h-4 w-4 mr-2" />
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem onClick={formatQuote}>
              <Quote className="h-4 w-4 mr-2" />
              Quote
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
            >
              <ListChecks className="h-4 w-4 mr-2" />
              Bullet List
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
            >
              <ListOrdered className="h-4 w-4 mr-2" />
              Numbered List
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)}
            >
              <ListCheck className="h-4 w-4 mr-2" />
              Check List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertHorizontalRule}>
              <SeparatorHorizontal className="h-4 w-4 mr-2" />
              Divider
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
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
