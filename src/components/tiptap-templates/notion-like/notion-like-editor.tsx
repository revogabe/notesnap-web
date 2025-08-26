"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { createPortal } from "react-dom"

// --- Tiptap Core Extensions ---
import StarterKit from "@tiptap/starter-kit"
import { TaskList, TaskItem } from "@tiptap/extension-list"
import Color from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import { Placeholder, Selection, Dropcursor } from "@tiptap/extensions"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Superscript } from "@tiptap/extension-superscript"
import { Subscript } from "@tiptap/extension-subscript"
import TextAlign from "@tiptap/extension-text-align"
import Mathematics from "@tiptap/extension-mathematics"
import UniqueID from "@tiptap/extension-unique-id"
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji"

// --- Hooks ---
import { useUiEditorState } from "@/hooks/use-ui-editor-state"
import { useScrollToHash } from "@/components/tiptap-ui/copy-anchor-link-button/use-scroll-to-hash"

// --- Custom Extensions ---
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { UiState } from "@/components/tiptap-extension/ui-state-extension"
import { Image } from "@/components/tiptap-node/image-node/image-node-extension"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { EmojiDropdownMenu } from "@/components/tiptap-ui/emoji-dropdown-menu"
import { SlashDropdownMenu } from "@/components/tiptap-ui/slash-dropdown-menu"
import { DragContextMenu } from "@/components/tiptap-ui/drag-context-menu"

// --- Lib ---
import { uploadImageToServer, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/notion-like/notion-like-editor.scss"

// --- Content ---
import { MobileToolbar } from "@/components/tiptap-templates/notion-like/notion-like-editor-mobile-toolbar"
import { NotionToolbarFloating } from "@/components/tiptap-templates/notion-like/notion-like-editor-toolbar-floating"
type EditorCreateParams = { editor: any }
type EditorUpdateParams = {
  editor: any
  transaction: unknown
  appendedTransactions: unknown[]
}

export interface NotionEditorProps {
  room: string
  placeholder?: string
  initialContent?: unknown
  onUpdate?: (params: any) => void
  onEditorReady?: (editor: any) => void
}

export interface EditorProviderProps {
  placeholder?: string
  initialContent?: unknown
  onUpdate?: (params: any) => void
  onEditorReady?: (editor: any) => void
  noteId?: string
}

/**
 * Loading spinner component shown while connecting to the notion server
 */
export function LoadingSpinner({ text = "Connecting..." }: { text?: string }) {
  return (
    <div className="spinner-container">
      <div className="spinner-content">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div className="spinner-loading-text">{text}</div>
      </div>
    </div>
  )
}

/**
 * EditorContent component that renders the actual editor
 */
export function EditorContentArea() {
  const { editor } = React.useContext(EditorContext)!
  const { isDragging } = useUiEditorState(editor)

  useScrollToHash()

  if (!editor) {
    return null
  }

  return (
    <EditorContent
      editor={editor}
      role="presentation"
      className="notion-like-editor-content"
      style={{
        cursor: isDragging ? "grabbing" : "auto",
      }}
    >
      <DragContextMenu />
      <EmojiDropdownMenu />
      <SlashDropdownMenu />
      <NotionToolbarFloating />

      {createPortal(<MobileToolbar />, document.body)}
    </EditorContent>
  )
}

/**
 * Component that creates and provides the editor instance
 */
export function EditorProvider(props: EditorProviderProps) {
  const {
    placeholder = "Write something...",
    initialContent,
    onUpdate,
    onEditorReady,
    noteId,
  } = props

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: "notion-like-editor",
      },
    },
    content: initialContent as any,
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: { openOnClick: false },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder,
        emptyNodeClass: "is-empty with-slash",
      }),
      Emoji.configure({
        emojis: gitHubEmojis.filter(
          (emoji) => !emoji.name.includes("regional")
        ),
        forceFallbackImages: true,
      }),
      Mathematics,
      Superscript,
      Subscript,
      Color,
      TextStyle,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Selection,
      Dropcursor.configure({ width: 2 }),
      Image,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: (file, onProgress, abortSignal) => {
          if (!noteId) {
            return Promise.reject(new Error("noteId is required for upload"))
          }
          return uploadImageToServer(noteId, file, onProgress, abortSignal)
        },
        onError: (error) => console.error("Upload failed:", error),
      }),
      UniqueID.configure({
        types: [
          "paragraph",
          "bulletList",
          "orderedList",
          "taskList",
          "heading",
          "blockquote",
          "codeBlock",
        ],
      }),
      Typography,
      UiState,
    ] as unknown as import("@tiptap/core").AnyExtension[],
    onCreate: (params: EditorCreateParams) => {
      try {
        onEditorReady?.(params.editor as any)
      } catch {}
    },
    onUpdate: (params: EditorUpdateParams) => {
      try {
        onUpdate?.(params)
      } catch {}
    },
  } as unknown as Parameters<typeof useEditor>[0])

  if (!editor) {
    return <LoadingSpinner />
  }

  return (
    <div className="notion-like-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <EditorContentArea />
      </EditorContext.Provider>
    </div>
  )
}

/**
 * Full editor with all necessary providers, ready to use with just a room ID
 */
export function NotionEditor({
  placeholder = "Start writing...",
  initialContent,
  onUpdate,
  onEditorReady,
}: NotionEditorProps) {
  return (
    <NotionEditorContent
      placeholder={placeholder}
      initialContent={initialContent}
      onUpdate={onUpdate}
      onEditorReady={onEditorReady}
    />
  )
}

/**
 * Internal component that handles the editor loading state
 */
export function NotionEditorContent({
  placeholder,
  initialContent,
  onUpdate,
  onEditorReady,
  noteId,
}: {
  placeholder?: string
  initialContent?: unknown
  onUpdate?: (params: any) => void
  onEditorReady?: (editor: any) => void
  noteId?: string
}) {
  return (
    <EditorProvider
      placeholder={placeholder}
      initialContent={initialContent}
      onUpdate={onUpdate}
      onEditorReady={onEditorReady}
      noteId={noteId}
    />
  )
}
