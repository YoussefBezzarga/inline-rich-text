import { ComponentConfig } from "@measured/puck"
import { SerializedEditorState } from "lexical"
import { Editor } from "./editor-client"
import { Render } from "./render-client"

export type RichTextEditorProps = {
  state: SerializedEditorState
}

export const RichTextEditor: ComponentConfig<RichTextEditorProps> = {
  fields: {
    state: {
      type: "custom",
      render: () => <></>,
    },
  },
  render: ({
    editMode,
    ...props
  }: {
    editMode?: boolean
    id: string
    state: SerializedEditorState
  }) => (editMode ? <Editor {...props} /> : <Render {...props} />),
}
