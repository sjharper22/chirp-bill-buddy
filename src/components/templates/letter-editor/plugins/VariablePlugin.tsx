
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { TextNode } from 'lexical';
import { $createVariableNode, VariableNode } from '../nodes/VariableNode';
import { mergeRegister } from '@lexical/utils';

export function VariablePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([VariableNode])) {
      throw new Error('VariablePlugin: VariableNode not registered on editor');
    }

    // Register a listener for variable format changes
    const removeTransform = editor.registerNodeTransform(TextNode, (textNode) => {
      const textContent = textNode.getTextContent();
      const variableRegex = /\{\{([^}]+)\}\}/g;
      
      // If there are no variables in the text, we don't need to do anything
      if (!variableRegex.test(textContent)) {
        return;
      }
      
      // Reset the regex lastIndex to ensure we catch all variables
      variableRegex.lastIndex = 0;
      
      let match;
      let lastIndex = 0;
      const nodes = [];
      
      // Find all variables in the text content
      while ((match = variableRegex.exec(textContent)) !== null) {
        const matchIndex = match.index;
        const variablePath = match[1];
        
        // Add text before the variable
        if (matchIndex > lastIndex) {
          const textBefore = textContent.slice(lastIndex, matchIndex);
          const splitNode = textNode.splitText(lastIndex, matchIndex)[0];
          nodes.push(splitNode);
        }
        
        // Create a variable node for the matched content
        const variableNode = $createVariableNode(variablePath);
        nodes.push(variableNode);
        
        lastIndex = matchIndex + match[0].length;
      }
      
      // Add any remaining text after the last variable
      if (lastIndex < textContent.length) {
        if (lastIndex === 0) {
          // If we didn't find any variables, there's nothing to do
          return;
        }
        
        const splitNode = textNode.splitText(lastIndex)[1];
        nodes.push(splitNode);
      }
      
      // If we found variables, replace the current node
      if (nodes.length > 0) {
        const parent = textNode.getParent();
        if (parent) {
          const index = textNode.getIndexWithinParent();
          textNode.remove();
          
          // Insert all our nodes at the right position
          for (let i = 0; i < nodes.length; i++) {
            parent.insertBefore(nodes[i], index + i >= parent.getChildrenSize() ? null : parent.getChildAtIndex(index + i));
          }
        }
      }
    });

    return () => {
      removeTransform();
    };
  }, [editor]);

  return null;
}
