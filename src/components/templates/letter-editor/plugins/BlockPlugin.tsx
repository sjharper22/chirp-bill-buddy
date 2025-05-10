
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
      // Fixed: Added the second argument with node types to transform
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
          // Fixed: Changed to wrap the node in a function that returns a block node
          $wrapNodeInElement(node, () => $createBlockNode(node.getType()));
        }
      }
    );

    return () => {
      removeTransform();
    };
  }, [editor]);

  return null;
}
