
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from "lexical";
import { $createHorizontalRuleNode, HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";

export const INSERT_HORIZONTAL_RULE_COMMAND: LexicalCommand<void> = createCommand(
  "INSERT_HORIZONTAL_RULE_COMMAND"
);

export function HorizontalRulePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([HorizontalRuleNode])) {
      throw new Error("HorizontalRulePlugin: HorizontalRuleNode not registered on editor");
    }

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
