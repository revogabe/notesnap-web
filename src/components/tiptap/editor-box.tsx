"use client"

import { ScrollArea } from "../ui/scroll-area"
import { NoteTools } from "../notes/note-tools"
import { useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Note } from "@/types"

import { useEditor } from "@tiptap/react"
import { NodeSelection } from "@tiptap/pm/state"
import { Button } from "../ui/button"
import { useSidebarStore } from "@/store/note-sidebar"
import { SidebarClose, SidebarOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { NotionEditor } from "@/components/tiptap-templates/notion-like/notion-like-editor"
import { updateUserNote } from "@/services/note.service"
import { toast } from "sonner"

export const EditorBox = (note: Note) => {
  const noteId = String(note._id)
  const { open, setOpen } = useSidebarStore()
  const [editorInstance, setEditorInstance] =
    useState<ReturnType<typeof useEditor>>()
  const lastContentRef = useRef<string | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const [noteTitle, setNoteTitle] = useState(note.title)

  const initialContent = useMemo(() => {
    return note.content ? JSON.parse(note.content) : ""
  }, [note.content])

  useEffect(() => {
    if (!editorInstance) return

    const channel = supabase.channel(`note-images-${noteId}`)
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "note_images",
        filter: `note_id=eq.${noteId}`,
      },
      (payload) => {
        if (payload.new.note_id === noteId) {
          const { state } = editorInstance
          const { selection } = state

          // If an image node is selected, insert AFTER it instead of replacing
          const insertPos =
            selection instanceof NodeSelection &&
            selection.node.type.name === "image"
              ? selection.to
              : selection.to

          editorInstance
            .chain()
            .focus()
            .insertContentAt(insertPos, {
              type: "image",
              attrs: { src: payload.new.file_url },
            })
            .run()
        }
      }
    )
    channel.subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [editorInstance, noteId])

  return (
    <ScrollArea className="h-full w-full flex-1 bg-background rounded-3xl ring-8 ring-border/15 border border-border overflow-hidden px-12 relative">
      <input
        type="text"
        value={noteTitle}
        onChange={(e) => {
          const newTitle = e.target.value
          setNoteTitle(newTitle)
          if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
          debounceTimeout.current = setTimeout(async () => {
            if (!newTitle) return
            try {
              await updateUserNote({ _id: noteId, title: newTitle })
            } catch {}
          }, 500)
        }}
        placeholder="Enter note title..."
        className="w-[720px] mx-auto text-2xl font-bold !font-sans border-b border-gray-300 pb-5 pt-16 focus:outline-none line-clamp-1"
      />
      <Button
        size="icon"
        variant="outline"
        className="mb-4 absolute left-5 top-5 size-12 rounded-2xl active:scale-[0.95] group"
        onClick={() => setOpen((open) => !open)}
      >
        {open ? (
          <SidebarClose className="size-5 text-muted-foreground group-hover:text-foreground/75 duration-150" />
        ) : (
          <SidebarOpen className="size-5 text-muted-foreground group-hover:text-foreground/75 duration-150" />
        )}
      </Button>
      <NoteTools noteId={noteId} />
      <NotionEditor
        room={noteId}
        placeholder="Write something..."
        initialContent={initialContent}
        onEditorReady={(editor) => setEditorInstance(editor)}
        onUpdate={({ editor }) => {
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
          }, 800)
        }}
      />
    </ScrollArea>
  )
}
