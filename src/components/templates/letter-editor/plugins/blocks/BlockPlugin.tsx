
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $createBlockNode } from '../../nodes/BlockNode';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import { ParagraphNode } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { validateRequiredNodes } from '../utils/plugin-utils';

export function BlockPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const requiredNodes = [ParagraphNode, HeadingNode, QuoteNode, HorizontalRuleNode];
    validateRequiredNodes(editor, requiredNodes, 'BlockPlugin');
    
    // Use mergeRegister to handle all transformations together
    const removeTransform = mergeRegister(
      // Register transform for ParagraphNode
      editor.registerNodeTransform(ParagraphNode, (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          parentNode.getType() === 'root'
        ) {
          $wrapNodeInElement(node, () => $createBlockNode());
        }
      }),

      // Register transform for HeadingNode
      editor.registerNodeTransform(HeadingNode, (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          parentNode.getType() === 'root'
        ) {
          $wrapNodeInElement(node, () => $createBlockNode());
        }
      }),

      // Register transform for QuoteNode
      editor.registerNodeTransform(QuoteNode, (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          parentNode.getType() === 'root'
        ) {
          $wrapNodeInElement(node, () => $createBlockNode());
        }
      }),

      // Register transform for HorizontalRuleNode
      editor.registerNodeTransform(HorizontalRuleNode, (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          parentNode.getType() === 'root'
        ) {
          $wrapNodeInElement(node, () => $createBlockNode());
        }
      })
    );

    return () => {
      removeTransform();
    };
  }, [editor]);

  return null;
}
