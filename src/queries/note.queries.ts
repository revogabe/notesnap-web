import { NoteModel } from "@/models/note.model"
import { Note } from "@/types"
import { serializeMongo } from "@/utils/serializeMongo"

export async function createNewNote(userId: string, userEmail: string) {
  return NoteModel.create({
    title: "Untitled Note",
    tags: [],
    images: [],
    companion: {
      visibility: "public",
      emailAllow: [userEmail],
    },
    userId: userId,
  })
}

export async function updateNote(input: Partial<Note> & { _id: string }) {
  const { _id, ...updateData } = input
  return NoteModel.updateOne(
    { _id },
    {
      ...updateData,
      updatedAt: new Date(),
    }
  )
}

export async function deleteNote(noteId: string, userId: string) {
  return NoteModel.deleteOne({ _id: noteId, userId: userId })
}

export async function findNotesByUser(userId: string) {
  const notes = await NoteModel.find({ userId }).lean()
  return serializeMongo(notes) as Note[] | null
}

export async function findNoteById(noteId: string) {
  const note = await NoteModel.findById(noteId).lean()
  return serializeMongo(note) as Note | null
}
