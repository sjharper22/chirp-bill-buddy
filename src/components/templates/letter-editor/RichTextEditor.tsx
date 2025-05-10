
import { useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { Card } from "@/components/ui/card";
import { ToolbarPlugin, VariableInsertPlugin } from './plugins';
import { createEditorConfig } from './config/editorConfig';
import { useEditorState } from './hooks/useEditorState';
import { EditorContent } from './components/EditorContent';
import { EditorPlugins } from './components/EditorPlugins';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string, htmlContent?: string) => void;
  placeholders?: Array<{ label: string; variable: string; group?: string }>;
}

export function RichTextEditor({ content, onChange, placeholders = [] }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const { editorState, handleEditorChange } = useEditorState({ 
    initialContent: content, 
    onChange 
  });
  
  const initialConfig = createEditorConfig();

  return (
    <Card className="overflow-hidden">
      <div ref={editorRef}>
        <LexicalComposer initialConfig={initialConfig}>
          <div className="border rounded-md">
            <ToolbarPlugin />
            
            <EditorContent />
            
            <div className="border-t p-2 bg-muted/30">
              <VariableInsertPlugin variables={placeholders} />
            </div>
          </div>
          
          <EditorPlugins 
            editorState={editorState} 
            onChange={handleEditorChange}
          />
        </LexicalComposer>
      </div>
    </Card>
  );
}
