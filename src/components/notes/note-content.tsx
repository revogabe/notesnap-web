import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TypographyH4,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { EditorBox } from "@/components/tiptap/editor-box"
import { Note } from "@/types"
import { DrawerClose } from "../ui/drawer"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu"
import { deleteUserNote } from "@/services/note.service"
import { toast } from "sonner"
import { useDrawerNoteStore } from "@/store/note-drawer"

type NoteContentPageProps = {
  note: Note
  notes: Note[]
  onNoteSelect?: (note: Note) => void
}

export function NoteContentPage({
  note,
  notes,
  onNoteSelect,
}: NoteContentPageProps) {
  const setActiveNote = useDrawerNoteStore((state) => state.setActiveNote)

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
      <aside className="w-full max-w-[300px] mr-6">
        <div
          className={cn(
            "flex gap-3 items-center justify-start w-full px-2.5 py-2.5",
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
            <TypographyMuted classID="text-xs font-sans">
              {note.updatedAt ? format(note.updatedAt, "PPp") : "Unknown date"}{" "}
              - Saved
            </TypographyMuted>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-100px)] overflow-y-auto relative pt-4">
          <div className="flex flex-col gap-1">
            {notes.map((n: Note) => (
              <ContextMenu key={`${n.title}-${n.updatedAt}`}>
                <ContextMenuTrigger asChild>
                  <button
                    onClick={() => onNoteSelect?.(n)}
                    className={cn(
                      "flex group flex-col duration-200 ease-out !transition-all items-start justify-center gap-0 w-full border border-transparent bg-transparent hover:bg-muted-foreground/10 rounded-xl px-2.5 py-2",
                      note._id === n._id &&
                        "border-background bg-radial-[at_100%_75%] to-transparent from-background shadow shadow-black/5"
                    )}
                  >
                    <TypographyP className="font-semibold font-sans text-foreground line-clamp-1">
                      {n.title}
                    </TypographyP>
                    <TypographyMuted className="text-xs font-sans">
                      {n.updatedAt
                        ? format(n.updatedAt, "PPp")
                        : "Unknown date"}{" "}
                      - Saved
                    </TypographyMuted>
                  </button>
                </ContextMenuTrigger>

                {/* Context menu (clique direito) - por segurança, também marcamos */}
                <ContextMenuContent className="overflow-hidden" data-stop-open>
                  <ContextMenuItem
                    data-stop-open
                    onClick={(e) => {
                      handleDeleteNote(e, String(n._id))
                    }}
                    variant="destructive"
                  >
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {"_id" in note ? (
        <EditorBox key={String(note._id)} {...note} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <TypographyH4>"Note not found."</TypographyH4>
        </div>
      )}
    </main>
  )
}
