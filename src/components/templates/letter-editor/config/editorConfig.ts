import { EditorConfig } from 'lexical';
import {
  BoldTextPlugin,
  ItalicTextPlugin,
  UnderlineTextPlugin,
  StrikethroughTextPlugin,
  CodeTextPlugin,
  SubscriptTextPlugin,
  SuperscriptTextPlugin,
  TextStylePlugin,
} from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { BlockTypePlugin } from '../plugins/blocks/BlockTypePlugin';
import { VariableNode } from '../nodes/VariableNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LinkNode, AutoLinkNode } from '@lexical/link';

export function createEditorConfig() {
  return {
    // Register all the nodes we are using
    nodes: [
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
    },
    onError: (error) => {
      console.error('Editor error:', error);
    },
  };
}
