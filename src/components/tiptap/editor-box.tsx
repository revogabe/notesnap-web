"use client"

import { ScrollArea } from "../ui/scroll-area"
import { NoteTools } from "../notes/note-tools"
import { NoteEditor } from "./editor"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Note } from "@/types"

import { useEditor } from "@tiptap/react"

export const EditorBox = (note: Note) => {
  const noteId = String(note._id)
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
    <ScrollArea className="h-full w-full flex-1 bg-background rounded-3xl ring-8 ring-border/15 border border-border overflow-hidden px-12">
      <NoteTools noteId={noteId} />
      <NoteEditor
        note={note}
        onImageReceived={(editor) => setEditorInstance(editor)}
      />
    </ScrollArea>
  )
}
