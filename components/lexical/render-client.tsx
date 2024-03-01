"use client";

import { LexicalEditor } from "./lexical-editor";
import { ComponentProps } from "react";

export function Render(props: ComponentProps<typeof LexicalEditor>) {
  return <LexicalEditor enabled={false} {...props} />;
}
