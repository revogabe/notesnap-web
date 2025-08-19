"use client"

import "@/app/globals.css"
import React, { useState } from "react"
import StarterKit from "@tiptap/starter-kit"

import { EditorContent, useEditor } from "@tiptap/react"
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus"
import {
  CharacterCount,
  Dropcursor,
  Placeholder,
  Selection,
} from "@tiptap/extensions"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import Document from "@tiptap/extension-document"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"
import { updateUserNote } from "@/services/note.service"
import { toast } from "sonner"

import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCaret from "@tiptap/extension-collaboration-caret"
import { CollabEditor, Note } from "@/types"
import { useNoteStore } from "@/store/note-store"

type NoteEditorProps = {
  note: Note
  userName?: string
  onImageReceived?: (editor: ReturnType<typeof useEditor>) => void
}

export const NoteEditor = ({
  note,
  userName,
  onImageReceived,
  provider,
  document: yjsDoc,
}: NoteEditorProps & CollabEditor) => {
  const noteId = String(note._id)

  const noteStore = useNoteStore()
  const storedNote = noteStore.getNote(noteId)

  const [noteTitle, setNoteTitle] = useState(note.title)

  const lastContentRef = React.useRef<string | null>(null)
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null)

  const initialContent = storedNote?.content
    ? JSON.parse(storedNote.content)
    : note.content
    ? JSON.parse(note.content)
    : ""

  const extensions = [
    StarterKit.configure({
      horizontalRule: false,
      link: { openOnClick: false, enableClickSelection: true },
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
    Document,
    CharacterCount.extend().configure({ limit: 10000 }),
    Placeholder.configure({ placeholder: "Write something..." }),
    Dropcursor,
  ]

  if (yjsDoc && provider) {
    extensions.push(
      Collaboration.configure({ document: yjsDoc }),
      CollaborationCaret.configure({ provider })
    )
  }

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
    extensions,
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
            noteStore.setNote({
              ...note,
              _id: noteId,
              title: noteTitle,
              content: contentString,
            })
          } catch (err) {
            toast("Failed to update note")
          }
        }
      }, 1000)
    },
    onContentError: ({ disableCollaboration }) => {
      disableCollaboration()
    },
  })

  React.useEffect(() => {
    if (!userName || !editor) return
    editor.chain().focus().updateUser({ name: userName }).run()
  }, [editor, userName])

  React.useEffect(() => {
    if (editor && onImageReceived) onImageReceived(editor)
  }, [editor, onImageReceived])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setNoteTitle(newTitle)

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)

    debounceTimeout.current = setTimeout(async () => {
      if (lastContentRef.current === newTitle || !newTitle) return
      await updateUserNote({ _id: noteId, title: newTitle })
      noteStore.setNote({
        ...note,
        _id: noteId,
        title: newTitle,
      })
    }, 500)
  }

  const TOOLS = React.useMemo(() => {
    if (!editor) return []
    return [
      {
        icon: "B",
        action: () => editor.chain().focus().toggleBold().run(),
        title: "Bold",
      },
      {
        icon: "I",
        action: () => editor.chain().focus().toggleItalic().run(),
        title: "Italic",
      },
      {
        icon: "U",
        action: () => editor.chain().focus().toggleUnderline().run(),
        title: "Underline",
      },
      {
        icon: "S",
        action: () => editor.chain().focus().toggleStrike().run(),
        title: "Strike",
      },
      {
        icon: "H",
        action: () => editor.chain().focus().toggleHighlight().run(),
        title: "Highlight",
      },
      {
        icon: "•",
        action: () => editor.chain().focus().toggleBulletList().run(),
        title: "Bullet List",
      },
      {
        icon: "1.",
        action: () => editor.chain().focus().toggleOrderedList().run(),
        title: "Numbered List",
      },
      {
        icon: "❝ ❞",
        action: () => editor.chain().focus().toggleBlockquote().run(),
        title: "Blockquote",
      },
    ]
  }, [editor])

  const BLOCK = React.useMemo(() => {
    if (!editor) return []
    return [
      {
        label: "H1",
        action: () => editor.chain().focus().setHeading({ level: 1 }).run(),
      },
      {
        label: "H2",
        action: () => editor.chain().focus().setHeading({ level: 2 }).run(),
      },
      {
        label: "H3",
        action: () => editor.chain().focus().setHeading({ level: 3 }).run(),
      },
      {
        label: "H4",
        action: () => editor.chain().focus().setHeading({ level: 4 }).run(),
      },
      {
        label: "H5",
        action: () => editor.chain().focus().setHeading({ level: 5 }).run(),
      },
      {
        label: "H6",
        action: () => editor.chain().focus().setHeading({ level: 6 }).run(),
      },
      {
        label: "P",
        action: () => editor.chain().focus().setParagraph().run(),
      },
      {
        label: "</>",
        action: () => editor.chain().focus().setCodeBlock().run(),
      },
    ]
  }, [editor])

  return (
    <div className="w-full mx-auto max-w-[720px] px-12">
      <input
        type="text"
        value={noteTitle}
        onChange={handleTitleChange}
        placeholder="Enter note title..."
        className="w-full mx-auto text-3xl font-bold border-b border-gray-300 pb-4 -mb-8 pt-16 focus:outline-none line-clamp-1"
      />

      {editor && (
        <BubbleMenu
          editor={editor}
          className="bg-background shadow-lg rounded-2xl p-1.5 flex flex-wrap gap-2 items-center border border-border
               opacity-0 scale-90 transform transition-all duration-200 ease-out
               animate-bubble-menu"
        >
          <ToggleGroup type="single" className="flex gap-1">
            {BLOCK.map((block) => (
              <ToggleGroupItem
                key={block.label}
                value={block.label}
                onClick={block.action}
                className="px-2 py-1 rounded-lg hover:bg-muted cursor-pointer text-muted-foreground font-medium text-sm"
              >
                {block.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup type="multiple" className="flex gap-1">
            {TOOLS.map((tool, idx) => (
              <ToggleGroupItem
                key={idx}
                value={tool.title}
                onClick={tool.action}
                className="px-2 py-1 rounded-lg hover:bg-muted cursor-pointer text-muted-foreground font-medium text-sm"
              >
                {tool.icon}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
