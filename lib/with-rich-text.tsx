import type { Config } from "@measured/puck";

type RichTextComponent<TState> = (props: {
  id: string;
  state: TState;
}) => JSX.Element;

export function withRichText<TState, TConfig extends Config>(
  config: TConfig,
  {
    Editor,
    Render,
  }: {
    Editor: RichTextComponent<TState>;
    Render: RichTextComponent<TState>;
  }
) {
  return {
    ...config,
    components: {
      ...config.components,
      RichText: {
        fields: {
          state: {
            type: "custom",
            render: () => null,
          },
        },
        render: ({
          editMode,
          ...props
        }: {
          id: string;
          editMode?: boolean;
          state: TState;
        }) => (editMode ? <Editor {...props} /> : <Render {...props} />),
      },
    },
  };
}
