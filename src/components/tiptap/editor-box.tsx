"use client"

import { ScrollArea } from "../ui/scroll-area"
import { NoteTools } from "../notes/note-tools"
import { NoteEditor } from "./editor"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Note } from "@/types"

export const EditorBox = ({ _id, content, companion }: Note) => {
  const noteId = String(_id)
  const [editorInstance, setEditorInstance] = useState<any>(null)

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
  }, [editorInstance, _id])

  return (
    <ScrollArea className="h-full w-full flex-1 bg-background rounded-3xl ring-8 ring-border/15 border border-border overflow-hidden">
      <NoteTools noteId={noteId} defaultVisibility={companion?.visibility} />
      <NoteEditor
        noteId={noteId}
        content={content}
        onImageReceived={(editor) => setEditorInstance(editor)}
      />
    </ScrollArea>
  )
}
