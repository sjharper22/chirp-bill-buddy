
import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread
} from 'lexical';

import { TextNode } from 'lexical';

export type SerializedVariableNode = Spread<{
  variableName: string;
  type: 'variable';
}, SerializedTextNode>;

export class VariableNode extends TextNode {
  __variableName: string;

  static getType(): string {
    return 'variable';
  }

  static clone(node: VariableNode): VariableNode {
    return new VariableNode(node.__variableName, node.__text, node.__key);
  }

  constructor(variableName: string, text?: string, key?: NodeKey) {
    super(text || `{{${variableName}}}`, key);
    this.__variableName = variableName;
    // Make variable nodes immutable to prevent text editing issues
    this.setMode('token'); // Changed from 'immutable' to 'token' which is a valid TextModeType
  }

  getVariableName(): string {
    return this.__variableName;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.classList.add('variable-node');
    dom.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';  // Light blue background
    dom.style.borderRadius = '4px';
    dom.style.padding = '1px 4px';
    dom.style.margin = '0 2px';
    dom.style.color = 'rgb(37, 99, 235)';  // Blue text color
    dom.style.fontWeight = 'bold';
    dom.style.cursor = 'default';
    dom.style.whiteSpace = 'nowrap';
    dom.setAttribute('data-variable', this.__variableName);
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importJSON(serializedNode: SerializedVariableNode): VariableNode {
    const node = $createVariableNode(serializedNode.variableName);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedVariableNode {
    return {
      ...super.exportJSON(),
      variableName: this.getVariableName(),
      type: 'variable'
    };
  }
  
  // Add method to make VariableNodes non-mergeable to prevent content issues
  canMergeWith(node: LexicalNode): boolean {
    return false;
  }
}

export function $createVariableNode(
  variableName: string
): VariableNode {
  return new VariableNode(variableName);
}

export function $isVariableNode(
  node: LexicalNode | null | undefined
): node is VariableNode {
  return node instanceof VariableNode;
}
