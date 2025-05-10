
import { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode } from '@lexical/rich-text';
import { EditorState } from 'lexical';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { Card } from "@/components/ui/card";
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import { VariableInsertPlugin } from './plugins/VariableInsertPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholders?: Array<{ label: string; variable: string }>;
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
      },
      heading: {
        h1: 'text-2xl font-bold py-2',
        h2: 'text-xl font-bold py-2',
        h3: 'text-lg font-bold py-1.5',
      },
      list: {
        ul: 'list-disc pl-5',
        ol: 'list-decimal pl-5',
      }
    },
    onError: (error: Error) => {
      console.error('Lexical editor error:', error);
    },
    nodes: [ListNode, ListItemNode, HeadingNode]
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
      onChange(json);
    });
  };

  return (
    <Card className="overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="border rounded-md">
          <ToolbarPlugin />
          
          <div className="p-4 bg-background">
            <RichTextPlugin
              contentEditable={<ContentEditable className="outline-none min-h-[300px]" />}
              placeholder={<div className="absolute top-[60px] left-4 text-muted-foreground">Start writing your template...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          
          <div className="border-t p-2 bg-muted/30">
            <VariableInsertPlugin variables={placeholders} />
          </div>
        </div>
        
        <HistoryPlugin />
        <ListPlugin />
        <OnChangePlugin onChange={handleEditorChange} />
      </LexicalComposer>
    </Card>
  );
}
