
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ParagraphNode, TextNode } from 'lexical';
import { VariableNode } from '../nodes/VariableNode';
import { BlockNode } from '../nodes/BlockNode';

export const createEditorConfig = (namespace = 'TemplateEditor') => {
  return {
    namespace,
    onError: (error: Error) => {
      console.error('Lexical editor error:', error);
    },
    theme: {
      root: 'p-0 min-h-[300px] focus:outline-none',
      link: 'cursor-pointer text-blue-500 underline',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
      },
      heading: {
        h1: 'text-2xl font-bold py-2',
        h2: 'text-xl font-bold py-2',
        h3: 'text-lg font-bold py-1.5',
        h4: 'text-base font-bold py-1',
        h5: 'text-sm font-bold py-1',
      },
      list: {
        ul: 'list-disc pl-5',
        ol: 'list-decimal pl-5',
        nested: {
          listitem: 'list-none',
        },
        listitem: 'ml-1 py-1',
        listitemChecked: 'ml-1 py-1',
        listitemUnchecked: 'ml-1 py-1',
      },
      quote: 'border-l-4 border-gray-200 pl-4 py-2 my-2 italic',
      horizontalRule: 'border-b border-gray-200 my-4',
      variable: 'bg-blue-100 text-blue-800 rounded px-1 py-0.5 whitespace-nowrap',
      block: {
        container: 'relative',
        dragHandle: 'absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab p-1 rounded hover:bg-gray-100',
      },
    },
    editable: true,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      ParagraphNode,
      TextNode,
      HorizontalRuleNode,
      VariableNode,
      BlockNode,
    ]
  };
};
