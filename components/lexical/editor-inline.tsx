"use client";

import type { SerializedEditorState } from "lexical/LexicalEditorState";
import { LexicalEditor } from "./lexical-editor";
import { useSelected } from "../../lib/use-selected";

export type RichTextProps = {
  state: SerializedEditorState;
};

export function Editor({
  id,
  state,
}: {
  id: string;
  state: SerializedEditorState;
}) {
  const { isSelected, onChange } = useSelected(id);

  return (
    <div
      style={{
        cursor: isSelected ? "default" : "grab",
        pointerEvents: "auto",
      }}
    >
      <LexicalEditor
        id={id}
        state={state}
        onChange={onChange}
        enabled={isSelected}
      />
    </div>
  );
}
