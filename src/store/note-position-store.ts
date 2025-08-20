import { Note } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Position {
  id: string
  x: number
  y: number
}

interface NotesPositionState {
  positions: Position[]
  setPosition: (id: string, x: number, y: number) => void
  initPositions: (notes: Note[]) => void
}

export const useNotesPositionStore = create<NotesPositionState>()(
  persist(
    (set) => ({
      positions: [],
      setPosition: (id, x, y) =>
        set((state) => {
          const exists = state.positions.find((p) => p.id === id)
          if (exists) {
            return {
              positions: state.positions.map((p) =>
                p.id === id ? { ...p, x, y } : p
              ),
            }
          }
          return { positions: [...state.positions, { id, x, y }] }
        }),

      initPositions: (notes) =>
        set((state) => {
          const existingIds = new Set(state.positions.map((p) => p.id))

          const newPositions = notes
            .filter((note) => !existingIds.has(String(note._id)))
            .map((note, idx) => ({
              id: String(note._id),
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            }))

          // mantém as antigas e adiciona só as novas
          return { positions: [...state.positions, ...newPositions] }
        }),
    }),
    {
      name: "notes-positions",
    }
  )
)
