"use client"

import "@/app/globals.css"
import React from "react"
import StarterKit from "@tiptap/starter-kit"

import { EditorContent, useEditor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import { Dropcursor, Placeholder, Selection } from "@tiptap/extensions"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"
import { updateUserNote } from "@/services/note.service"
import { toast } from "sonner"

type NoteEditorProps = {
  noteId: string
  content?: string
  onImageReceived?: (editor: ReturnType<typeof useEditor>) => void
}

export const NoteEditor = ({
  noteId,
  content,
  onImageReceived,
}: NoteEditorProps) => {
  const lastContentRef = React.useRef<string | null>(null)
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null)

  const initialContent = content ? JSON.parse(content) : ""

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "w-full outline-none mx-auto max-w-[720px] py-24",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      Placeholder.configure({
        placeholder: "Write something...",
      }),
      Dropcursor,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const contentJSON = editor.getJSON()
      const contentString = JSON.stringify(contentJSON)

      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)

      debounceTimeout.current = setTimeout(async () => {
        if (lastContentRef.current !== contentString) {
          try {
            await updateUserNote({ _id: noteId, content: contentString })
            lastContentRef.current = contentString
          } catch (err) {
            toast("Failed to update note")
          }
        }
      }, 1000)
    },
  })

  React.useEffect(() => {
    if (editor && onImageReceived) onImageReceived(editor)
  }, [editor, onImageReceived])

  const TOOLS = React.useMemo(
    () => ({
      bold: {
        icon: "B",
        action: () => editor?.chain().focus().toggleBold().run(),
      },
      italic: {
        icon: "I",
        action: () => editor?.chain().focus().toggleItalic().run(),
      },
      strike: {
        icon: "S",
        action: () => editor?.chain().focus().toggleStrike().run(),
      },
    }),
    [editor]
  )

  return (
    <>
      {editor && (
        <BubbleMenu className="bubble-menu" editor={editor}>
          <ToggleGroup type="multiple">
            {Object.entries(TOOLS).map(([key, { icon, action }]) => (
              <ToggleGroupItem key={key} value={key} onClick={action}>
                {icon}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </>
  )
}
