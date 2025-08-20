"use client"

import dynamic from "next/dynamic"
import { InfiniteCanvas } from "@/components/canva/infinite-canvas"
import { Note } from "@/types"

const NotesCanvas = dynamic(
  () => import("./notes-canvas").then((m) => m.NotesCanvas),
  { ssr: false }
)

export function NotesClientPage({ notes }: { notes: Note[] }) {
  return (
    <>
      <InfiniteCanvas>
        <NotesCanvas notes={notes} />
      </InfiniteCanvas>
    </>
  )
}
