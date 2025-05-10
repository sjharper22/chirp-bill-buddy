
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $createBlockNode } from '../nodes/BlockNode';
import { $wrapNodeInElement } from '@lexical/utils';
import { ParagraphNode } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

export function BlockPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Register a custom transformation to wrap paragraphs and headings
    // in block nodes for drag-and-drop functionality
    const removeTransform = editor.registerNodeTransform(
      ParagraphNode,
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

    // Register transforms for other node types
    const headingTransform = editor.registerNodeTransform(
      HeadingNode, 
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
      QuoteNode,
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
      HorizontalRuleNode,
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
