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
      <div className="fixed top-24 left-0 w-full text-center italic font-sans font-semibold space-y-0.5">
        <p className="text-muted-foreground text-sm">
          Press{" "}
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 leading-0 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-sm mt-0.5 mr-0.5">⌘</span>+ T
          </kbd>{" "}
          to open the menu
        </p>
        <span className="text-xs text-muted-foreground">
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 leading-0 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            Space
          </kbd>
          {` and drag to move canvas`}
        </span>
      </div>
      <InfiniteCanvas>
        <NotesCanvas notes={notes} />
      </InfiniteCanvas>
    </>
  )
}
