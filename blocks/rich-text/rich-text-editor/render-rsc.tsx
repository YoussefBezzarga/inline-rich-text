import type { SerializedEditorState } from "lexical/LexicalEditorState"
import { ServerSideRender } from "./lexical/server-side-render"

export async function Render(props: {
  state: SerializedEditorState
}): Promise<JSX.Element> {
  return <ServerSideRender {...props} />
}
