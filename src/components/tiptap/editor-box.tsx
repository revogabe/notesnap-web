"use client"

import { ScrollArea } from "../ui/scroll-area"
import { NoteTools } from "../notes/note-tools"
import { NoteEditor } from "./editor"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Note } from "@/types"

import * as Y from "yjs"
import { TiptapCollabProvider } from "@tiptap-pro/provider"
import { useEditor } from "@tiptap/react"
import { authClient } from "@/lib/auth-client"
import { updateUserNote } from "@/services/note.service"
import { useRouter } from "next/navigation"

const appId = "y9w5jrp9"

export const EditorBox = (note: Note) => {
  const noteId = String(note._id)
  const [editorInstance, setEditorInstance] =
    useState<ReturnType<typeof useEditor>>()

  const [user, setUser] = useState<{
    name: string
    avatar?: string | null
  } | null>(null)
  const [collaborators, setCollaborators] = useState<
    { name: string; avatar?: string | null }[]
  >([])

  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null)
  const [document, setDocument] = useState<Y.Doc | null>(null)

  const [visibility, setVisibility] = useState<"public" | "private">(
    note.companion?.visibility || "private"
  )

  const handleVisibilityChange = async (
    newVisibility: "public" | "private"
  ) => {
    await updateUserNote({
      _id: noteId,
      companion: {
        visibility: newVisibility,
      },
    })
    setVisibility(newVisibility)

    if (newVisibility === "private" && provider && editorInstance) {
      provider.destroy()
      editorInstance.destroy()
      setProvider(null)
      setCollaborators([])
      return
    }

    if (newVisibility === "public") window.location.reload()
  }

  useEffect(() => {
    authClient.getSession().then((result) => {
      if ("data" in result && result.data?.user) {
        setUser({
          name: result.data.user.name,
          avatar: result.data.user.image,
        })
      } else {
        setUser(null)
      }
    })
  }, [])

  useEffect(() => {
    if (note.companion?.visibility === "private") return

    let cancelled = false
    let doc: Y.Doc | null = null
    let prov: TiptapCollabProvider | null = null

    // Lazy load provider/document
    const loadProvider = async () => {
      try {
        doc = new Y.Doc()
        prov = new TiptapCollabProvider({
          appId,
          name: `note:${noteId}`,
          document: doc,
          token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTU1MzY3NDEsIm5iZiI6MTc1NTUzNjc0MSwiZXhwIjoxNzU1NjIzMTQxLCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiJ5OXc1anJwOSJ9.fLX1cLi3JR47zD4yOfxK0lsIbBuiHK8hjo-PaIkXU14",
        })

        if (prov.awareness && user) {
          prov.awareness.setLocalStateField("user", {
            name: user.name,
            avatar: user.avatar,
          })
        }

        if (cancelled) return
        setDocument(doc)
        setProvider(prov)

        const updateUsers = () => {
          const states = prov!.awareness
            ? Array.from(prov!.awareness.getStates().values())
            : []
          const users = states.map((s: any) => s.user).filter(Boolean)
          setCollaborators(users)
        }

        if (prov.awareness) {
          prov.awareness.on("change", updateUsers)
        }
        updateUsers()
      } catch (err) {
        // Silencie erro de conexão websocket
        setProvider(null)
        setDocument(null)
        setCollaborators([])
      }
    }

    // Lazy load após pequeno delay para evitar erro imediato
    const timeout = setTimeout(loadProvider, 500)

    return () => {
      cancelled = true
      clearTimeout(timeout)
      if (prov && prov.awareness) prov.awareness.off("change", () => {})
      if (prov) prov.destroy()
      if (doc) doc.destroy()
    }
  }, [noteId, note.companion?.visibility, user])

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
      <NoteTools
        noteId={noteId}
        visibility={visibility}
        onVisibilityChange={handleVisibilityChange}
        collaborators={collaborators}
      />
      {visibility === "private" ? (
        <NoteEditor
          note={note}
          onImageReceived={(editor) => setEditorInstance(editor)}
        />
      ) : provider && document ? (
        <NoteEditor
          note={note}
          userName={user?.name}
          onImageReceived={(editor) => setEditorInstance(editor)}
          provider={provider}
          room={`note:${noteId}`}
          document={document}
        />
      ) : (
        <div className="flex items-center justify-center w-full py-32 text-muted-foreground">
          <p>No document available for editing.</p>
        </div>
      )}
    </ScrollArea>
  )
}
