import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TypographyH4,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { getUserNoteById, getUserNotes } from "@/services/note.service"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { EditorBox } from "@/components/tiptap/editor-box"

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const note = await getUserNoteById(id)
  const notes = await getUserNotes()

  return (
    <main className="w-full flex h-screen items-start justify-between overflow-hidden bg-secondary p-5">
      <aside className="w-full max-w-[300px] mr-4">
        <div
          className={cn(
            "flex gap-3 items-center justify-start w-full px-2.5 py-2.5",
            "border border-border rounded-2xl",
            "bg-background",
            "shadow-md shadow-black/5"
          )}
        >
          <Button size="icon" variant="outline" asChild>
            <Link href="/notes">
              <ChevronLeft />
            </Link>
          </Button>
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
        <ScrollArea className="h-[calc(100vh-100px)] overflow-y-auto pr-4 relative pt-4">
          <div className="flex flex-col gap-1">
            {notes.map((note) => (
              <Link
                href={`/note/${note._id}`}
                key={`${note.title}-${note.updatedAt}`}
                className={cn(
                  "flex group flex-col duration-200 ease-out !transition-all items-start justify-center gap-0 w-full border border-transparent bg-transparent hover:bg-muted-foreground/10 rounded-xl px-2.5 py-2",
                  id === note._id &&
                    "border-background bg-radial-[at_100%_75%] to-transparent from-background shadow shadow-black/5"
                )}
              >
                <TypographyP className="font-semibold font-sans text-foreground line-clamp-1">
                  {note.title}
                </TypographyP>
                <TypographyMuted className="text-xs font-sans">
                  {note.updatedAt
                    ? format(note.updatedAt, "PPp")
                    : "Unknown date"}{" "}
                  - Saved
                </TypographyMuted>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </aside>

      <EditorBox {...note} />

      <div className="h-full w-full max-w-[500px] bg-background rounded-3xl ring-8 ring-border/15 border border-border ml-8">
        <ScrollArea className="p-4">right</ScrollArea>
      </div>
    </main>
  )
}
