
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { TextNode } from 'lexical';
import { $isVariableNode, $createVariableNode, VariableNode } from '../../nodes/VariableNode';
import { validateRequiredNodes } from '../utils/plugin-utils';

export function VariablePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    validateRequiredNodes(editor, [VariableNode], 'VariablePlugin');

    // Register a listener for variable format changes
    const removeTransform = editor.registerNodeTransform(TextNode, (textNode) => {
      // Skip transformation if this node is already being processed or is a child of a variable node
      if (textNode.__isProcessing || $isVariableNode(textNode.getParent())) {
        return;
      }
      
      const textContent = textNode.getTextContent();
      const variableRegex = /\{\{([^}]+)\}\}/g;
      
      // If there are no variables in the text, we don't need to do anything
      if (!variableRegex.test(textContent)) {
        return;
      }
      
      // Mark this node as being processed to prevent infinite loops
      textNode.__isProcessing = true;
      
      try {
        // Reset the regex lastIndex to ensure we catch all variables
        variableRegex.lastIndex = 0;
        
        const matches: Array<{ index: number; match: string; variable: string }> = [];
        let match;
        
        // Find all variables in the text content without splitting yet
        while ((match = variableRegex.exec(textContent)) !== null) {
          matches.push({
            index: match.index,
            match: match[0],
            variable: match[1]
          });
        }
        
        // If we found matches, process them from right to left to maintain correct indices
        if (matches.length > 0) {
          // Sort matches in reverse order to process from right to left
          matches.sort((a, b) => b.index - a.index);
          
          let currentNode = textNode;
          
          for (const { index, match, variable } of matches) {
            // Split the text at the variable position
            if (index > 0) {
              const [, rightPart] = currentNode.splitText(index);
              currentNode = rightPart;
            }
            
            // Split after the variable
            if (index + match.length < currentNode.getTextContent().length) {
              const [leftPart] = currentNode.splitText(match.length);
              currentNode = leftPart;
            }
            
            // Now currentNode contains only the variable text
            // Replace it with a variable node
            const variableNode = $createVariableNode(variable);
            currentNode.replace(variableNode);
          }
        }
      } finally {
        // Clean up the processing flag
        delete textNode.__isProcessing;
      }
    });

    return () => {
      removeTransform();
    };
  }, [editor]);

  return null;
}
