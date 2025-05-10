
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $createBlockNode } from '../nodes/BlockNode';
import { $wrapNodeInElement } from '@lexical/utils';

export function BlockPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Register a custom transformation to wrap paragraphs and headings
    // in block nodes for drag-and-drop functionality
    const removeTransform = editor.registerNodeTransform(
      (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          !parentNode.is('block') && 
          parentNode.getType() === 'root' &&
          (node.getType() === 'paragraph' || 
           node.getType() === 'heading' || 
           node.getType() === 'quote' ||
           node.getType() === 'horizontalrule')
        ) {
          const blockNode = $createBlockNode(node.getType());
          $wrapNodeInElement(node, blockNode);
        }
      }
    );

    return () => {
      removeTransform();
    };
  }, [editor]);

  return null;
}
