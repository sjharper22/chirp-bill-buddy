
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

    // Detect and convert variables like {{variable.path}}
    const variableTransform = editor.registerNodeTransform(TextNode, (textNode) => {
      const textContent = textNode.getTextContent();
      const variableRegex = /\{\{([^}]+)\}\}/g;
      let match;
      let lastIndex = 0;
      const nodes = [];
      
      // Find all variable patterns in the text
      while ((match = variableRegex.exec(textContent)) !== null) {
        const matchIndex = match.index;
        const variablePath = match[1];
        
        // If there's text before the match, add it as a TextNode
        if (matchIndex > lastIndex) {
          const textBefore = textContent.slice(lastIndex, matchIndex);
          nodes.push(textNode.splitText(lastIndex, matchIndex)[0]);
        }
        
        // Create a variable node for the match
        const variableNode = $createVariableNode(variablePath);
        nodes.push(variableNode);
        
        lastIndex = matchIndex + match[0].length;
      }
      
      // If there's text after the last match, add it as a TextNode
      if (lastIndex < textContent.length) {
        if (lastIndex === 0) {
          // No variables were found
          return;
        }
        
        const textAfter = textContent.slice(lastIndex);
        nodes.push(textNode.splitText(lastIndex)[1]);
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
      variableTransform();
    };
  }, [editor]);

  return null;
}
