// store/note-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Note } from "@/types"

type NoteState = {
  notes: Note[]
  setNote: (note: Note) => void
  getNote: (noteId: string) => Note | null
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      setNote: (note) => {
        set((state) => {
          const existingIndex = state.notes.findIndex((n) => n._id === note._id)
          let newNotes
          if (existingIndex > -1) {
            newNotes = [...state.notes]
            newNotes[existingIndex] = note
          } else {
            newNotes = [...state.notes, note]
          }
          return { notes: newNotes }
        })
      },
      getNote: (noteId) => {
        return get().notes.find((n) => n._id === noteId) || null
      },
    }),
    { name: "note-store" }
  )
)
