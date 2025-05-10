
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from "lexical";
import { $createHorizontalRuleNode, HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { validateRequiredNodes } from '../utils/plugin-utils';

export const INSERT_HORIZONTAL_RULE_COMMAND: LexicalCommand<void> = createCommand(
  "INSERT_HORIZONTAL_RULE_COMMAND"
);

export function HorizontalRulePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    validateRequiredNodes(editor, [HorizontalRuleNode], 'HorizontalRulePlugin');

    return editor.registerCommand(
      INSERT_HORIZONTAL_RULE_COMMAND,
      () => {
        editor.update(() => {
          const horizontalRuleNode = $createHorizontalRuleNode();
          const selection = editor.getEditorState().read(() => editor._editorState._selection);
          if (selection) {
            selection.insertNodes([horizontalRuleNode]);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
