"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import {
  findNotesByUser,
  findNoteById,
  createNewNote,
  deleteNote,
  updateNote,
} from "@/queries/note.queries"
import { revalidatePath } from "next/cache"
import { Note } from "@/types"

export async function createUserNote() {
  // if user is not authenticated
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")

  const userId = session.user.id
  const userEmail = session.user.email
  const note = await createNewNote(userId, userEmail)

  if (!note) throw new Error("Failed to create note")

  revalidatePath(`/notes`)
  return { id: note.id }
}

export async function updateUserNote(note: Partial<Note> & { _id: string }) {
  // if user is not authenticated
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")

  const result = await updateNote(note)

  if (!result) throw new Error("Failed to update note")

  revalidatePath(`/notes/${note._id}`)
  return { message: "Note updated successfully" }
}

export async function deleteUserNote(noteId: string) {
  // if user is not authenticated
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")

  const userId = session.user.id
  const result = await deleteNote(noteId, userId)

  if (!result) throw new Error("Failed to delete note")

  revalidatePath(`/notes`)
  return { message: "Note deleted successfully" }
}

export async function getUserNotes() {
  // if user is not authenticated
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")

  const userId = session.user.id
  const notes = await findNotesByUser(userId)

  if (!notes) throw new Error("Failed to retrieve notes")

  return notes
}

export async function getUserNoteById(noteId: string) {
  const session = await auth.api.getSession({ headers: await headers() })

  const note = await findNoteById(noteId)
  if (!note) throw new Error("Note not found")

  if (note.companion?.visibility === "private") {
    if (!session || session.user.id !== String(note.userId)) {
      throw new Error("Unauthorized")
    }
  }

  if (
    note.companion?.visibility === "public" &&
    Array.isArray(note.companion.emailAllow) &&
    note.companion.emailAllow.length > 0
  ) {
    if (!session) throw new Error("Unauthorized")
    if (!note.companion.emailAllow.includes(session.user.email)) {
      throw new Error("Not allowed for this email")
    }
  }

  return note
}
