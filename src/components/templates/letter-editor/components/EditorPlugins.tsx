
import React from 'react';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState } from 'lexical';
import { 
  BlockPlugin, 
  BlockTypePlugin, 
  DragDropPlugin,
  HorizontalRulePlugin
} from '../plugins';
import { VariablePlugin } from '../plugins/variables/VariablePlugin';

interface EditorPluginsProps {
  editorState: string | null;
  onChange: (state: EditorState) => void;
}

export function EditorPlugins({ editorState, onChange }: EditorPluginsProps) {
  return (
    <>
      <HistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <HorizontalRulePlugin />
      <VariablePlugin />
      <BlockPlugin />
      <DragDropPlugin />
      <BlockTypePlugin />
      <OnChangePlugin onChange={onChange} />
    </>
  );
}
