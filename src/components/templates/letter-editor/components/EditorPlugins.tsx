
import React from 'react';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { HorizontalRulePlugin } from '../plugins/HorizontalRulePlugin';
import { VariablePlugin } from '../plugins/VariablePlugin';
import { BlockPlugin } from '../plugins/BlockPlugin';
import { DragDropPlugin } from '../plugins/DragDropPlugin';
import { BlockTypePlugin } from '../plugins/BlockTypePlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState } from 'lexical';

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
      {editorState && <OnChangePlugin onChange={onChange} />}
      {!editorState && <OnChangePlugin onChange={onChange} />}
    </>
  );
}
