"use client"

import { NoteEditor } from "@/components/tiptap/editor"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TypographyH4,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { NOTES } from "@/mock/notes"
import { formatDate } from "@/utils/formatDate"
import { compareDesc, format } from "date-fns"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function NotePage() {
  const params = useParams<{ id: string }>()
  const note = NOTES.find((note) => note.id === params.id)

  const groupedNotes = NOTES.reduce<Record<string, typeof NOTES>>(
    (groups, note) => {
      const dateKey = formatDate(note.updated_at)
      ;(groups[dateKey] ||= []).push(note)
      return groups
    },
    {}
  )

  const sortedDates = Object.keys(groupedNotes).sort((a, b) =>
    compareDesc(groupedNotes[a][0].updated_at, groupedNotes[b][0].updated_at)
  )

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
            <Link href="/">
              <ChevronLeft />
            </Link>
          </Button>
          <div>
            <TypographyH4 className="font-bold text-base line-clamp-1 font-sans">
              {note?.title}
            </TypographyH4>
            <TypographyMuted classID="text-xs font-sans">
              {note?.updated_at
                ? format(note.updated_at, "PP")
                : "Unknown date"}{" "}
              - Last Saved
            </TypographyMuted>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-100px)] overflow-y-auto pr-4 relative pt-4">
          {sortedDates.map((date) => (
            <div key={date} className="flex flex-col mb-6">
              <div className="flex gap-5 mb-2 items-center justify-start w-full opacity-70">
                <TypographyMuted>{date}</TypographyMuted>
                <div className="bg-border w-full h-px flex-1" />
              </div>

              <div className="flex flex-col gap-1">
                {groupedNotes[date].map((note) => (
                  <Link
                    href={`/note/${note.id}`}
                    key={note.id}
                    className={cn(
                      "flex group flex-col duration-200 ease-out !transition-all items-start justify-center gap-0 w-full border border-transparent bg-transparent hover:bg-muted-foreground/10 rounded-xl px-2.5 py-2",
                      params?.id === note.id &&
                        "border-background bg-radial-[at_100%_75%] to-transparent from-background shadow shadow-black/5"
                    )}
                  >
                    <TypographyP className="font-semibold font-sans text-foreground line-clamp-1">
                      {note.title}
                    </TypographyP>
                    <TypographyMuted className="text-xs font-sans">
                      {note.updated_at
                        ? format(note.updated_at, "PP")
                        : "Unknown date"}{" "}
                      - Last Saved
                    </TypographyMuted>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </aside>
      <ScrollArea className="h-full w-full flex-1 bg-background rounded-3xl ring-8 ring-border/15 border border-border overflow-hidden">
        <NoteEditor qrCode={`http://localhost:3000/companion/${params.id}`} />
      </ScrollArea>
      <div className="h-full w-full max-w-[500px] bg-background rounded-3xl ring-8 ring-border/15 border border-border ml-8">
        <ScrollArea className="p-4">right</ScrollArea>
      </div>
    </main>
  )
}
