import { Note } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type DrawerNoteState = {
  activeNote: Note | null
  setActiveNote: (note: Note | null) => void
}

export const useDrawerNoteStore = create<DrawerNoteState>()(
  persist(
    (set) => ({
      activeNote: null,
      setActiveNote: (note) => set({ activeNote: note }),
    }),
    {
      name: "drawer-note-store",
    }
  )
)
