import type { Config } from "@measured/puck"
import { RichTextEditor, RichTextEditorProps } from "blocks/rich-text"
import { Columns, ColumnsProps } from "./blocks/columns"

export const config: Config<{
  RichTextEditor: RichTextEditorProps
  Columns: ColumnsProps
}> = {
  root: {
    render: ({ children }) => {
      return <div style={{ padding: 64, maxWidth: "900px" }}>{children}</div>
    },
  },
  components: {
    Columns,
    RichTextEditor,
  },
}
