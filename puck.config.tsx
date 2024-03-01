import type { Config } from "@measured/puck";
import { InlineEditor } from "./components/lexical/inline-editor";
import { LexicalClient } from "./components/lexical/client";

export const config: Config = {
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
    RichText: {
      fields: {
        state: {
          type: "custom",
          render: () => null,
        },
      },
      render: ({ editMode, ...props }) =>
        editMode ? (
          <InlineEditor {...props} />
        ) : (
          <LexicalClient editing={false} {...props} />
        ),
    },
  },
};

export default config;
