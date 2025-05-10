
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
      // Fixed: Added appropriate node types to transform as second argument
      'paragraph', // First argument: node type to transform
      (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          !parentNode.is('block') && 
          parentNode.getType() === 'root'
        ) {
          // Fixed: Changed to wrap the node in a function that returns a block node
          $wrapNodeInElement(node, () => $createBlockNode(node.getType()));
        }
      }
    );

    // Register transforms for other node types (heading, quote, horizontalrule)
    const headingTransform = editor.registerNodeTransform(
      'heading', 
      (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          !parentNode.is('block') && 
          parentNode.getType() === 'root'
        ) {
          $wrapNodeInElement(node, () => $createBlockNode(node.getType()));
        }
      }
    );

    const quoteTransform = editor.registerNodeTransform(
      'quote',
      (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          !parentNode.is('block') && 
          parentNode.getType() === 'root'
        ) {
          $wrapNodeInElement(node, () => $createBlockNode(node.getType()));
        }
      }
    );

    const hrTransform = editor.registerNodeTransform(
      'horizontalrule',
      (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          !parentNode.is('block') && 
          parentNode.getType() === 'root'
        ) {
          $wrapNodeInElement(node, () => $createBlockNode(node.getType()));
        }
      }
    );

    return () => {
      removeTransform();
      headingTransform();
      quoteTransform();
      hrTransform();
    };
  }, [editor]);

  return null;
}
