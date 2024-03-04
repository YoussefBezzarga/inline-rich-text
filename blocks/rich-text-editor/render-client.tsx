"use client";

import { InlineRichTextEditor } from "./lexical/rich-text-editor";
import { ComponentProps } from "react";

export function Render(
  props: Omit<ComponentProps<typeof InlineRichTextEditor>, "enabled">
) {
  return <InlineRichTextEditor enabled={false} {...props} />;
}
