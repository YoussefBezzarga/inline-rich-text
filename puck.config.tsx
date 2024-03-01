import type { Config } from "@measured/puck";
import { Editor } from "./components/lexical/editor-inline";
import { Render } from "./components/lexical/render-client";
import { withRichText } from "./lib/with-rich-text";

export const config: Config<{
  HeadingBlock: { title: string };
}> = {
  root: {
    render: ({ children }) => {
      return <div style={{ padding: 64, maxWidth: "600px" }}>{children}</div>;
    },
  },
  components: {
    HeadingBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "Heading",
      },
      render: ({ title }) => <h1>{title}</h1>,
    },
  },
};

export default withRichText(config, { Editor: Editor, Render: Render });
