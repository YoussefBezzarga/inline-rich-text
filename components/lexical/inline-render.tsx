import type { SerializedEditorState } from "lexical/LexicalEditorState";
import { getHtml } from "./get-html";

export const InlineRender = async (props: { state: SerializedEditorState }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: await getHtml(props.state),
      }}
    />
  );
};
