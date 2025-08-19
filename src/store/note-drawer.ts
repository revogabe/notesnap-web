import { Note } from "@/types"
import { create } from "zustand"

type DrawerNoteState = {
  activeNote: Note | null
  setActiveNote: (note: Note | null) => void
}

export const useDrawerNoteStore = create<DrawerNoteState>((set) => ({
  activeNote: null,
  setActiveNote: (note) => set({ activeNote: note }),
}))
