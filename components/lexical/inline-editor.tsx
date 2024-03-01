"use client";

import { usePuck } from "@measured/puck";
import { SerializedEditorState } from "lexical";
import { LexicalClient } from "./client";

const useSelected = (componentId: string) => {
  const {
    appState: {
      ui: { itemSelector },
      data,
    },
    dispatch,
  } = usePuck();

  if (!itemSelector) {
    return {
      isSelected: false,
      onChange: () => {},
    };
  }

  const item =
    itemSelector.zone && itemSelector.zone !== "default-zone"
      ? data.zones[itemSelector.zone][itemSelector.index]
      : data.content[itemSelector.index];

  if (item.props.id !== componentId) {
    return {
      isSelected: false,
      onChange: () => {},
    };
  }

  return {
    isSelected: true,
    onChange: (props: Partial<typeof item.props>) =>
      dispatch({
        type: "replace",
        destinationIndex: itemSelector.index,
        destinationZone: itemSelector.zone,
        data: {
          props: { ...item.props, ...props },
          type: item.type,
        },
      }),
  };
};

export function InlineEditor({
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
      <LexicalClient
        id={id}
        state={state}
        onChange={onChange}
        editing={isSelected}
      />
    </div>
  );
}
