
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { LexicalNode, Klass } from 'lexical';

/**
 * Validates that required node types are registered with the editor.
 * 
 * @param editor The Lexical editor instance
 * @param nodeClasses Array of node classes that should be registered
 * @param pluginName Name of the plugin for error logging
 */
export function validateRequiredNodes(
  editor: ReturnType<typeof useLexicalComposerContext>[0],
  nodeClasses: Klass<LexicalNode>[],
  pluginName: string
): void {
  // Validate if all required nodes are registered
  nodeClasses.forEach(nodeClass => {
    const nodeType = nodeClass.getType();
    
    if (!editor._nodes.has(nodeType)) {
      console.warn(
        `${pluginName}: ${nodeType} node is not registered! ` +
        `Make sure to add it to the "nodes" array in your editor config.`
      );
    }
  });
}
