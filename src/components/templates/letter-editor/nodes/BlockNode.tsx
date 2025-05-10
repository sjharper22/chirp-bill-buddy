
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread
} from 'lexical';

import { ElementNode } from 'lexical';

export type SerializedBlockNode = Spread<
  {
    blockType: string;
    type: 'block';
  },
  SerializedElementNode
>;

export class BlockNode extends ElementNode {
  __blockType: string;

  static getType(): string {
    return 'block';
  }

  static clone(node: BlockNode): BlockNode {
    return new BlockNode(node.__blockType, node.__key);
  }

  constructor(blockType: string = 'default', key?: NodeKey) {
    super(key);
    this.__blockType = blockType || 'default';
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('div');
    element.className = 'group relative ' + (config.theme.block?.container || '');
    
    // Add drag handle
    const dragHandle = document.createElement('div');
    dragHandle.className = config.theme.block?.dragHandle || '';
    dragHandle.setAttribute('data-drag-handle', 'true');
    
    // Create an icon for the drag handle
    const dragIcon = document.createElement('span');
    dragIcon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4H6V6H4V4Z" fill="currentColor" />
        <path d="M10 4H12V6H10V4Z" fill="currentColor" />
        <path d="M4 10H6V12H4V10Z" fill="currentColor" />
        <path d="M10 10H12V12H10V10Z" fill="currentColor" />
      </svg>
    `;
    
    dragHandle.appendChild(dragIcon);
    element.appendChild(dragHandle);
    
    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (domNode.classList.contains('group')) {
          return {
            conversion: convertBlockElement,
            priority: 1,
          };
        }
        return null;
      },
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement('div');
    const children = this.getChildren();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childDOM = child.exportDOM(editor).element;
      if (childDOM) {
        element.appendChild(childDOM);
      }
    }
    return { element };
  }

  static importJSON(serializedNode: SerializedBlockNode): BlockNode {
    const node = $createBlockNode(serializedNode.blockType);
    return node;
  }

  exportJSON(): SerializedBlockNode {
    return {
      ...super.exportJSON(),
      blockType: this.__blockType,
      type: 'block',
    };
  }

  getBlockType(): string {
    return this.__blockType;
  }

  setBlockType(blockType: string): void {
    this.__blockType = blockType;
  }

  // Fix the is() method to match the expected signature
  is(object: LexicalNode | string): boolean {
    if (typeof object === 'string') {
      return object === 'block' || super.is(object);
    }
    return object instanceof BlockNode || super.is(object);
  }
}

function convertBlockElement(domNode: HTMLElement): DOMConversionOutput {
  const blockType = domNode.getAttribute('data-block-type') || 'default';
  const node = $createBlockNode(blockType);
  return { node };
}

export function $createBlockNode(blockType: string = 'default'): BlockNode {
  return new BlockNode(blockType);
}

export function $isBlockNode(
  node: LexicalNode | null | undefined
): node is BlockNode {
  return node instanceof BlockNode;
}
