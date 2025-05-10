
import React from 'react';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

export function EditorContent() {
  return (
    <div className="p-4 bg-background">
      <RichTextPlugin
        contentEditable={<ContentEditable className="outline-none min-h-[300px] pl-10" />}
        placeholder={<div className="absolute top-[60px] left-14 text-muted-foreground">Start writing your template...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </div>
  );
}
