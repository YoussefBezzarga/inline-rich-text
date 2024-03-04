"use server";

import type { ComponentProps } from "react";
import { ServerSideRender } from "./lexical/server-side-render";

export async function Render(
  props: ComponentProps<typeof ServerSideRender>
): Promise<JSX.Element> {
  return <ServerSideRender {...props} />;
}
