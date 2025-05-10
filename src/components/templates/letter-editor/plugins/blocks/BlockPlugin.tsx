
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
    // First check if the BlockNode is registered
    const nodeList = [ParagraphNode, HeadingNode, QuoteNode, HorizontalRuleNode];
    validateRequiredNodes(editor, nodeList, 'BlockPlugin');
    
    // Use mergeRegister to handle all transformations together
    const removeTransform = mergeRegister(
      // Register transform for ParagraphNode
      editor.registerNodeTransform(ParagraphNode, (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          parentNode.getType() === 'root'
        ) {
          try {
            $wrapNodeInElement(node, () => $createBlockNode());
          } catch (error) {
            console.error('Error wrapping node in BlockNode:', error);
          }
        }
      }),

      // Register transform for HeadingNode
      editor.registerNodeTransform(HeadingNode, (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          parentNode.getType() === 'root'
        ) {
          try {
            $wrapNodeInElement(node, () => $createBlockNode());
          } catch (error) {
            console.error('Error wrapping node in BlockNode:', error);
          }
        }
      }),

      // Register transform for QuoteNode
      editor.registerNodeTransform(QuoteNode, (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          parentNode.getType() === 'root'
        ) {
          try {
            $wrapNodeInElement(node, () => $createBlockNode());
          } catch (error) {
            console.error('Error wrapping node in BlockNode:', error);
          }
        }
      }),

      // Register transform for HorizontalRuleNode
      editor.registerNodeTransform(HorizontalRuleNode, (node) => {
        const parentNode = node.getParent();
        if (
          parentNode && 
          parentNode.getType() === 'root'
        ) {
          try {
            $wrapNodeInElement(node, () => $createBlockNode());
          } catch (error) {
            console.error('Error wrapping node in BlockNode:', error);
          }
        }
      })
    );

    return () => {
      removeTransform();
    };
  }, [editor]);

  return null;
}
