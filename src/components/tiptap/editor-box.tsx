"use client"

import { ScrollArea } from "../ui/scroll-area"
import { NoteTools } from "../notes/note-tools"
import { NoteEditor } from "./editor"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Note } from "@/types"

import { useEditor } from "@tiptap/react"
import { Button } from "../ui/button"
import { useSidebarStore } from "@/store/note-sidebar"
import { SidebarClose, SidebarOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export const EditorBox = (note: Note) => {
  const noteId = String(note._id)
  const { open, setOpen } = useSidebarStore()
  const [editorInstance, setEditorInstance] =
    useState<ReturnType<typeof useEditor>>()

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
          editorInstance
            .chain()
            .focus()
            .setImage({ src: payload.new.file_url })
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
      <NoteEditor
        note={note}
        onImageReceived={(editor) => setEditorInstance(editor)}
      />
    </ScrollArea>
  )
}
