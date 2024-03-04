/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { $isParentElementRTL, $setBlocksType } from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { Dispatch, useCallback, useEffect, useState } from "react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { getSelectedNode } from "../../utils/getSelectedNode";
import { sanitizeUrl } from "../../utils/url";
import { createPortal } from "react-dom";
import {
  Bold,
  Italic,
  RemoveFormatting,
  AlignLeft,
  AlignRight,
  AlignJustify,
  AlignCenter,
  LucideIcon,
  Pilcrow,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ListOrdered,
  List,
  TextQuote,
} from "lucide-react";
import { Button } from "../../ui/button";
import { getToolbarPortal } from "../../utils/getToolbarPortal";

import styles from "./styles.module.css";
import getClassNameFactory from "../../../../../lib/get-class-name-factory";

const getClassName = getClassNameFactory("ToolbarPlugin", styles);

const IS_APPLE =
  typeof navigator !== "undefined" && navigator.userAgent.includes("Mac OS X");

const blockFormats = {
  paragraph: { label: "Paragaph", Icon: Pilcrow },
  h1: { label: "Heading 1", Icon: Heading1 },
  h2: { label: "Heading 2", Icon: Heading2 },
  h3: { label: "Heading 3", Icon: Heading3 },
  h4: { label: "Heading 4", Icon: Heading4 },
  h5: { label: "Heading 5", Icon: Heading5 },
  h6: { label: "Heading 6", Icon: Heading6 },
  bullet: { label: "Bulleted List", Icon: List },
  number: { label: "Numbered List", Icon: ListOrdered },
  quote: { label: "Quote", Icon: TextQuote },
  code: { label: "Code Block", Icon: Code },
} as const;

function BlockFormatDropDown({
  editor,
  blockType,
  disabled = false,
}: {
  blockType: keyof typeof blockFormats;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createParagraphNode());
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const TriggerIcon = blockFormats[blockType].Icon;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={getClassName("action")}
        disabled={disabled}
        aria-label="Formatting options for text style"
      >
        <TriggerIcon size={16} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          style={{
            background: "var(--puck-color-grey-01)",
            padding: "4px",
            borderRadius: "8px",
            fontSize: "var(--puck-font-size-xxxs)",
            fontFamily: "var(--puck-font-family)",
          }}
        >
          <DropdownMenu.Item
            style={{ justifyContent: "left" }}
            className={getClassName("action")}
            onClick={formatParagraph}
          >
            <blockFormats.paragraph.Icon size={16} />
            <span style={{ marginLeft: "4px" }}>
              {blockFormats.paragraph.label}
            </span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{ justifyContent: "left" }}
            className={getClassName("action")}
            onClick={() => formatHeading("h1")}
          >
            <blockFormats.h1.Icon size={16} />
            <span style={{ marginLeft: "4px" }}>{blockFormats.h1.label}</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{ justifyContent: "left" }}
            className={getClassName("action")}
            onClick={() => formatHeading("h2")}
          >
            <blockFormats.h2.Icon size={16} />
            <span style={{ marginLeft: "4px" }}>{blockFormats.h2.label}</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{ justifyContent: "left" }}
            className={getClassName("action")}
            onClick={() => formatHeading("h3")}
          >
            <blockFormats.h3.Icon size={16} />
            <span style={{ marginLeft: "4px" }}>{blockFormats.h3.label}</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{ justifyContent: "left" }}
            className={getClassName("action")}
            onClick={() => formatHeading("h4")}
          >
            <blockFormats.h4.Icon size={16} />
            <span style={{ marginLeft: "4px" }}>{blockFormats.h4.label}</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{ justifyContent: "left" }}
            className={getClassName("action")}
            onClick={() => formatHeading("h5")}
          >
            <blockFormats.h5.Icon size={16} />
            <span style={{ marginLeft: "4px" }}>{blockFormats.h5.label}</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{ justifyContent: "left" }}
            className={getClassName("action")}
            onClick={() => formatHeading("h6")}
          >
            <blockFormats.h6.Icon size={16} />
            <span style={{ marginLeft: "4px" }}>{blockFormats.h6.label}</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{ justifyContent: "left" }}
            className={getClassName("action")}
            onClick={formatBulletList}
          >
            <blockFormats.bullet.Icon size={16} />
            <span style={{ marginLeft: "4px" }}>
              {blockFormats.bullet.label}
            </span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{ justifyContent: "left" }}
            className={getClassName("action")}
            onClick={formatNumberedList}
          >
            <blockFormats.number.Icon size={16} />
            <span style={{ marginLeft: "4px" }}>
              {blockFormats.number.label}
            </span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{ justifyContent: "left" }}
            className={getClassName("action")}
            onClick={formatQuote}
          >
            <blockFormats.quote.Icon size={16} />
            <span style={{ marginLeft: "4px" }}>
              {blockFormats.quote.label}
            </span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, "">]: {
    Icon: LucideIcon;
    IconRTL: LucideIcon;
    name: string;
    command: string;
  };
} = {
  left: {
    Icon: AlignLeft,
    IconRTL: AlignLeft,
    name: "Left Align",
    command: "left",
  },
  center: {
    Icon: AlignCenter,
    IconRTL: AlignCenter,
    name: "Center Align",
    command: "center",
  },
  justify: {
    Icon: AlignJustify,
    IconRTL: AlignJustify,
    name: "Justify Align",
    command: "justify",
  },
  right: {
    Icon: AlignRight,
    IconRTL: AlignRight,
    name: "Right Align",
    command: "right",
  },
  start: {
    Icon: AlignLeft,
    IconRTL: AlignRight,
    name: "Start Align",
    command: "start",
  },
  end: {
    Icon: AlignRight,
    IconRTL: AlignLeft,
    name: "End Align",
    command: "end",
  },
};

function ElementFormatDropdown({
  editor,
  value,
  isRTL,
}: {
  editor: LexicalEditor;
  value: ElementFormatType;
  isRTL: boolean;
}) {
  const formatOption = ELEMENT_FORMAT_OPTIONS[value || "left"];

  const TriggerIcon = isRTL ? formatOption.IconRTL : formatOption.Icon;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={getClassName("action")}>
        <TriggerIcon size={16} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          style={{
            background: "var(--puck-color-grey-01)",
            padding: "4px",
            borderRadius: "8px",
            fontSize: "var(--puck-font-size-xxxs)",
            fontFamily: "var(--puck-font-family)",
          }}
        >
          {Object.keys(ELEMENT_FORMAT_OPTIONS).map((key) => {
            const { Icon, IconRTL, name, command } =
              ELEMENT_FORMAT_OPTIONS[key];
            return (
              <DropdownMenu.Item
                key={key}
                style={{ justifyContent: "left" }}
                className={getClassName("action")}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, command);
                }}
              >
                {isRTL ? <IconRTL size={16} /> : <Icon size={16} />}
                <span style={{ marginLeft: "4px" }}>{name}</span>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function ToolbarPlugin({
  id,
  showToolbar,
  setIsLinkEditMode,
}: {
  id: string;
  showToolbar: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockFormats>("paragraph");

  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const [isRTL, setIsRTL] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          if (type in blockFormats) {
            setBlockType(type as keyof typeof blockFormats);
          }
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockFormats) {
            setBlockType(type as keyof typeof blockFormats);
          }
        }
      }
      // Handle buttons
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || "left"
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      })
    );
  }, [$updateToolbar, editor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === "KeyK" && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;
          if (!isLink) {
            setIsLinkEditMode(true);
            url = sanitizeUrl("https://");
          } else {
            setIsLinkEditMode(false);
            url = null;
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node;
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode;
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode;
            }

            if (textNode.__style !== "") {
              textNode.setStyle("");
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat("");
            }
            node = textNode;
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat("");
          }
        });
      }
    });
  }, [activeEditor]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"));
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink, setIsLinkEditMode]);

  const portalTarget = getToolbarPortal(id);

  if (!showToolbar) {
    return null;
  }

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <div
      style={{
        display: "flex",
        gap: "4px",
        paddingLeft: "12px",
      }}
    >
      <BlockFormatDropDown blockType={blockType} editor={editor} />

      <ElementFormatDropdown
        value={elementFormat}
        editor={editor}
        isRTL={isRTL}
      />
      <Button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        active={isBold}
        title={IS_APPLE ? "Bold (⌘B)" : "Bold (Ctrl+B)"}
        aria-label={`Format text as bold. Shortcut: ${
          IS_APPLE ? "⌘B" : "Ctrl+B"
        }`}
      >
        <Bold size={16} />
      </Button>
      <Button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        active={isItalic}
        title={IS_APPLE ? "Italic (⌘I)" : "Italic (Ctrl+I)"}
        aria-label={`Format text as italics. Shortcut: ${
          IS_APPLE ? "⌘I" : "Ctrl+I"
        }`}
      >
        <Italic size={16} />
      </Button>
      {/*<Button
        onClick={insertLink}
        className={"toolbar-item spaced " + (isLink ? "active" : "")}
        aria-label="Insert link"
        title="Insert link"
      >
        a
      </Button>*/}
      <Button
        onClick={clearFormatting}
        aria-label="Clear all text formatting"
        title="Clear text formatting"
      >
        <RemoveFormatting size={16} />
      </Button>
    </div>,
    portalTarget
  );
}
