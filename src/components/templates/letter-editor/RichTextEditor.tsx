import { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { EditorState } from 'lexical';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { Card } from "@/components/ui/card";
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import { VariableInsertPlugin } from './plugins/VariableInsertPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { DragDropPlugin } from './plugins/DragDropPlugin';
import { BlockTypePlugin } from './plugins/BlockTypePlugin';
// Fixed: Using only ListItemNode, removed CheckListItemNode which doesn't exist
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { VariableNode } from './nodes/VariableNode';
import { VariablePlugin } from './plugins/VariablePlugin';
import { BlockNode } from './nodes/BlockNode';
import { BlockPlugin } from './plugins/BlockPlugin';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string, htmlContent?: string) => void;
  placeholders?: Array<{ label: string; variable: string; group?: string }>;
}

export function RichTextEditor({ content, onChange, placeholders = [] }: RichTextEditorProps) {
  const [editorState, setEditorState] = useState<string | null>(null);
  
  const initialConfig = {
    namespace: 'TemplateEditor',
    theme: {
      root: 'p-0 min-h-[300px] focus:outline-none',
      link: 'cursor-pointer text-blue-500 underline',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
      },
      heading: {
        h1: 'text-2xl font-bold py-2',
        h2: 'text-xl font-bold py-2',
        h3: 'text-lg font-bold py-1.5',
        h4: 'text-base font-bold py-1',
        h5: 'text-sm font-bold py-1',
      },
      list: {
        ul: 'list-disc pl-5',
        ol: 'list-decimal pl-5',
        nested: {
          listitem: 'list-none',
        },
        listitem: 'ml-1 py-1',
        listitemChecked: 'ml-1 py-1',
        listitemUnchecked: 'ml-1 py-1',
      },
      quote: 'border-l-4 border-gray-200 pl-4 py-2 my-2 italic',
      horizontalRule: 'border-b border-gray-200 my-4',
      variable: 'bg-blue-100 text-blue-800 rounded px-1 py-0.5 whitespace-nowrap',
      block: {
        container: 'relative',
        dragHandle: 'absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab p-1 rounded hover:bg-gray-100',
      },
    },
    onError: (error: Error) => {
      console.error('Lexical editor error:', error);
    },
    nodes: [
      ListNode,
      ListItemNode,
      HeadingNode,
      QuoteNode,
      HorizontalRuleNode,
      VariableNode,
      BlockNode
    ]
  };

  // Initialize the editor with the content when it mounts
  useEffect(() => {
    if (editorState === null && content) {
      setEditorState(content);
    }
  }, [content, editorState]);

  const handleEditorChange = (state: EditorState) => {
    state.read(() => {
      const json = JSON.stringify(state.toJSON());
      
      // Generate HTML representation for preview
      const htmlContent = generateHtmlContent(state);
      
      onChange(json, htmlContent);
    });
  };
  
  // Function to generate HTML content from editor state
  const generateHtmlContent = (state: EditorState): string => {
    let htmlContent = '';
    
    state.read(() => {
      // Create a temporary DOM element to render the content
      const tempDiv = document.createElement('div');
      const root = state._nodeMap.get('root');
      
      if (root && root.getChildren) {
        const children = root.getChildren();
        
        children.forEach((node: any) => {
          if (node.getType) {
            const nodeType = node.getType();
            
            // Handle different node types
            if (nodeType === 'paragraph') {
              const text = node.getTextContent();
              // Process variables in text
              const processedText = text.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
                return `<span class="variable">${match}</span>`;
              });
              
              tempDiv.innerHTML += `<p>${processedText}</p>`;
            } 
            else if (nodeType === 'heading') {
              const tag = `h${node.getTag()}`;
              const text = node.getTextContent();
              tempDiv.innerHTML += `<${tag}>${text}</${tag}>`;
            }
            else if (nodeType === 'list') {
              const listType = node.getListType() === 'number' ? 'ol' : 'ul';
              tempDiv.innerHTML += `<${listType}>${node.getChildren().map((li: any) => 
                `<li>${li.getTextContent()}</li>`).join('')}</${listType}>`;
            }
            else if (nodeType === 'quote') {
              const text = node.getTextContent();
              tempDiv.innerHTML += `<blockquote>${text}</blockquote>`;
            }
            else if (nodeType === 'horizontalrule') {
              tempDiv.innerHTML += '<hr />';
            }
            else if (nodeType === 'variable') {
              const variableName = node.getVariableName();
              tempDiv.innerHTML += `<span class="variable">{{${variableName}}}</span>`;
            }
            else {
              // Default handling for other node types
              tempDiv.innerHTML += node.getTextContent();
            }
          }
        });
      }
      
      htmlContent = tempDiv.innerHTML;
    });
    
    return htmlContent;
  };

  return (
    <Card className="overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="border rounded-md">
          <ToolbarPlugin />
          
          <div className="p-4 bg-background">
            <RichTextPlugin
              contentEditable={<ContentEditable className="outline-none min-h-[300px] pl-10" />}
              placeholder={<div className="absolute top-[60px] left-14 text-muted-foreground">Start writing your template...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          
          <div className="border-t p-2 bg-muted/30">
            <VariableInsertPlugin variables={placeholders} />
          </div>
        </div>
        
        <HistoryPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <BlockPlugin />
        <DragDropPlugin />
        <BlockTypePlugin />
        <VariablePlugin />
        <OnChangePlugin onChange={handleEditorChange} />
      </LexicalComposer>
    </Card>
  );
}
