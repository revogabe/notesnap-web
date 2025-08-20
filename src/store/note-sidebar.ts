import { Note } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type SidebarNoteStore = {
  open: boolean
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void
}

export const useSidebarStore = create<SidebarNoteStore>()(
  persist(
    (set) => ({
      open: false,
      setOpen: (open) =>
        set((state) => ({
          open:
            typeof open === "function"
              ? (open as (prev: boolean) => boolean)(state.open)
              : open,
        })),
    }),
    {
      name: "sidebar-note-store",
    }
  )
)
