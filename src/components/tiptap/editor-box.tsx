"use client"

import { ScrollArea } from "../ui/scroll-area"
import { NoteTools } from "../notes/note-tools"
import { NoteEditor } from "./editor"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { CollabEditor, Note } from "@/types"

import * as Y from "yjs"
import { TiptapCollabProvider } from "@tiptap-pro/provider"
import { useEditor } from "@tiptap/react"
import { authClient } from "@/lib/auth-client"

const appId = "y9w5jrp9"

export const EditorBox = ({ _id, content, companion }: Note) => {
  const noteId = String(_id)
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
    if (companion?.visibility === "private") return

    const doc = new Y.Doc()
    const prov = new TiptapCollabProvider({
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

    setDocument(doc)
    setProvider(prov)

    const updateUsers = () => {
      const states = prov.awareness
        ? Array.from(prov.awareness.getStates().values())
        : []
      const users = states
        .map((s: any) => s.user) // aqui pegamos o campo `user` do awareness
        .filter(Boolean)
      setCollaborators(users)
    }

    if (prov.awareness) {
      prov.awareness.on("change", updateUsers)
    }
    updateUsers()

    return () => {
      if (prov.awareness) prov.awareness.off("change", updateUsers)
      prov.destroy()
      doc.destroy()
    }
  }, [noteId, companion?.visibility])

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
      <NoteTools
        noteId={noteId}
        defaultVisibility={companion?.visibility}
        collaborators={collaborators}
      />
      {companion?.visibility === "private" ? (
        <NoteEditor
          noteId={noteId}
          content={content}
          onImageReceived={(editor) => setEditorInstance(editor)}
        />
      ) : (
        provider &&
        document && (
          <NoteEditor
            noteId={noteId}
            content={content}
            userName={user?.name}
            onImageReceived={(editor) => setEditorInstance(editor)}
            provider={provider}
            room={`note:${noteId}`}
            document={document}
          />
        )
      )}
    </ScrollArea>
  )
}
