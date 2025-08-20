"use client"

import {
  TypographyH4,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DrawerClose } from "@/components/ui/drawer"

import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { EditorBox } from "@/components/tiptap/editor-box"
import { ChevronDown } from "lucide-react"

import { Note } from "@/types"
import { deleteUserNote } from "@/services/note.service"
import { useDrawerNoteStore } from "@/store/note-drawer"
import { AnimatePresence, motion } from "motion/react"
import { useSidebarStore } from "@/store/note-sidebar"

type NoteContentProps = {
  note: Note
  notes: Note[]
  onNoteSelect?: (note: Note) => void
}

export function NoteContent({ note, notes, onNoteSelect }: NoteContentProps) {
  const setActiveNote = useDrawerNoteStore((state) => state.setActiveNote)
  const { open } = useSidebarStore()

  const handleDeleteNote = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation()
    e.preventDefault()
    if (!noteId) return
    const response = await deleteUserNote(noteId)
    if (noteId === String(note._id)) setActiveNote(null)
    if (response.message) return toast(response.message)
  }

  return (
    <main className="w-full flex h-screen items-start justify-between overflow-hidden bg-secondary p-5">
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            key="note-sidebar"
            initial={{ width: 0, marginRight: 0, opacity: 0 }}
            animate={{ width: 300, marginRight: 24, opacity: 1 }}
            exit={{ width: 0, marginRight: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "flex gap-3 items-center justify-start w-full px-2.5 py-2.5 truncate",
                "border border-border rounded-3xl",
                "bg-background"
              )}
            >
              <DrawerClose asChild>
                <Button size="icon" variant="outline" className="rounded-xl">
                  <ChevronDown />
                </Button>
              </DrawerClose>
              <div>
                <TypographyH4 className="font-bold text-base line-clamp-1 font-sans">
                  {note.title}
                </TypographyH4>
                <TypographyMuted className="text-xs font-sans">
                  {note.updatedAt
                    ? format(note.updatedAt, "PPp")
                    : "Unknown date"}{" "}
                  - Saved
                </TypographyMuted>
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-100px)] overflow-y-auto relative pt-4 truncate">
              <div className="flex flex-col gap-1">
                {notes.map((n: Note) => (
                  <NoteListCard
                    key={`${n.title}-${n.updatedAt}`}
                    note={n}
                    currentId={String(note._id)}
                    onNoteSelect={onNoteSelect}
                    onDeleteNote={(e) => handleDeleteNote(e, String(n._id))}
                  />
                ))}
              </div>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>

      <EditorBox key={String(note._id)} {...note} />
    </main>
  )
}

const NoteListCard = (props: {
  note: Note
  currentId: string
  onDeleteNote: (e: React.MouseEvent) => void
  onNoteSelect?: (note: Note) => void
}) => {
  const { note, currentId, onDeleteNote, onNoteSelect } = props

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            onClick={() => onNoteSelect?.(note)}
            className={cn(
              "flex group flex-col duration-200 ease-out !transition-all items-start justify-center gap-0 w-full border border-transparent bg-transparent hover:bg-muted-foreground/10 rounded-xl px-2.5 py-2",
              currentId === note._id &&
                "border-background bg-radial-[at_100%_75%] to-transparent from-background shadow shadow-black/5"
            )}
          >
            <TypographyP className="font-semibold font-sans text-foreground line-clamp-1">
              {note.title}
            </TypographyP>
            <TypographyMuted className="text-xs font-sans">
              {note.updatedAt ? format(note.updatedAt, "PPp") : "Unknown date"}{" "}
              - Saved
            </TypographyMuted>
          </button>
        </ContextMenuTrigger>

        <ContextMenuContent className="overflow-hidden" data-stop-open>
          <ContextMenuItem
            data-stop-open
            onClick={onDeleteNote}
            variant="destructive"
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}
