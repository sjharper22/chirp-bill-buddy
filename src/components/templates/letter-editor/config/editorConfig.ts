
import { EditorConfig } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { VariableNode } from '../nodes/VariableNode';
import { BlockNode } from '../nodes/BlockNode';

export function createEditorConfig() {
  return {
    // Register all the nodes we are using
    nodes: [
      BlockNode,
      VariableNode,
      HeadingNode,
      QuoteNode,
      ListItemNode,
      ListNode,
      HorizontalRuleNode,
      LinkNode,
      AutoLinkNode
    ],
    namespace: 'LetterEditor',
    theme: {
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
      },
      list: {
        nested: {
          listitem: 'ml-4',
        },
        ol: 'list-decimal ml-6',
        ul: 'list-disc ml-6',
      },
      variable: 'variable-node',
      block: {
        container: 'py-1',
        dragHandle: 'absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 cursor-grab'
      }
    },
    onError: (error) => {
      console.error('Editor error:', error);
    },
  };
}
