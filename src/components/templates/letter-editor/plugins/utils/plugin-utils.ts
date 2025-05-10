
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
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
  // First check if the editor has the nodes registered using hasNodes
  if (!editor.hasNodes(nodeClasses)) {
    console.warn(
      `${pluginName}: Some required nodes are not registered! ` +
      `Make sure to add them to the "nodes" array in your editor config.`
    );
  }
  
  // Additional check for each specific node
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
