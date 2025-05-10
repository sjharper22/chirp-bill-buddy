
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { validateRequiredNodes } from '../utils/plugin-utils';
import { ParagraphNode } from 'lexical';
import { HeadingNode } from '@lexical/rich-text';

export function BlockTypePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Optional: validate required nodes if needed
    validateRequiredNodes(editor, [ParagraphNode, HeadingNode], 'BlockTypePlugin');
    
    // This plugin will handle keyboard shortcuts for block types
    const removeListener = editor.registerTextContentListener((text) => {
      const lines = text.split('\n');
      const lastLine = lines[lines.length - 1];
      
      if (lastLine === '# ') {
        // Convert to heading 1
        editor.update(() => {
          // Implementation will go here in a future update
        });
      }
    });

    return () => {
      removeListener();
    };
  }, [editor]);

  return null;
}
