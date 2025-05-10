
import { LexicalEditor, LexicalNode } from 'lexical';

/**
 * Ensures that required nodes are registered on the editor
 * 
 * @param editor The Lexical editor instance
 * @param requiredNodes Array of node classes that should be registered
 * @param pluginName Name of the plugin (for error messages)
 */
export function validateRequiredNodes(
  editor: LexicalEditor, 
  requiredNodes: Array<{ getType: () => string }>,
  pluginName: string
): void {
  if (!editor.hasNodes(requiredNodes)) {
    throw new Error(`${pluginName}: required nodes not registered on editor`);
  }
}

/**
 * Safely gets a node's parent, checking for null
 * 
 * @param node The LexicalNode to get the parent from
 * @returns The parent node or null if it doesn't exist
 */
export function getNodeParent(node: LexicalNode): LexicalNode | null {
  return node.getParent();
}
