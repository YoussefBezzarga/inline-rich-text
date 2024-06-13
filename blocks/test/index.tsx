import type { ComponentConfig } from "@measured/puck";
import type { SerializedEditorState } from "lexical";
import { Editor } from "blocks/rich-text/rich-text-editor/editor-client";
import { Render } from "blocks/rich-text/rich-text-editor/render-client";
import React from "react";
import styles from "./Test.module.css"; // Assuming you have a CSS module for styles

export type TestProps = {
  state: SerializedEditorState;
};

const Text = ({editMode, ...props}:  {
    editMode?: boolean
    id: string
    state: SerializedEditorState}) => {
    console.log(`state:${props.id}`, props.state)
    return editMode ? <Editor {...props} /> : <Render {...props} />
}

export const Test = {
  fields: {
    state: {
      type: "custom",
      render: () => <></>,
    },
  },
  render: (props) => {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Text {...props} id={props.id}/>
          <Text {...props} id={props.id+'2'}/>
        </div>
        <div className={styles.buttons}>
          <button className={styles.button}>En savoir plus</button>
          <button className={styles.buttonPrimary}>Obtenir un audit</button>
        </div>
        <div className={styles.bubbles}>
          <div className={styles.bubble}>Rapid Prototype</div>
          <div className={styles.bubble}>Technology Migration</div>
          <div className={styles.bubble}>Web app</div>
          <div className={styles.bubble}>Mobile app</div>
          <div className={styles.bubble}>Data Science</div>
          <div className={styles.bubble}>AI</div>
        </div>
      </div>
    );
  },
} satisfies ComponentConfig<TestProps>;
