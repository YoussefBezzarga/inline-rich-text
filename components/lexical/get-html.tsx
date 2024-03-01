"use server";

import { $generateHtmlFromNodes } from "@lexical/html";
import { createHeadlessEditor } from "@lexical/headless";
import { SerializedEditorState } from "lexical";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

function setupDom() {
  const dom = new JSDOM();

  const _window = global.window;
  const _document = global.document;

  // @ts-expect-error
  global.window = dom.window;
  global.document = dom.window.document;

  return () => {
    global.window = _window;
    global.document = _document;
  };
}

export async function getHtml(
  serializedEditorState: SerializedEditorState
): Promise<string> {
  if (!serializedEditorState) {
    return null;
  }

  const editor = createHeadlessEditor({
    namespace: "ssr-editor",
    onError: (error) => {
      console.log("headless lexical error", error);
    },
  });

  editor.setEditorState(editor.parseEditorState(serializedEditorState));

  return new Promise((resolve) =>
    editor.update(() => {
      const cleanup = setupDom();
      const purify = DOMPurify(window);
      try {
        const raw = $generateHtmlFromNodes(editor);
        const html = purify.sanitize(raw);

        resolve(html);
      } finally {
        cleanup();
      }
    })
  );
}
