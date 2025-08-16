"use client"

import { NoteCard } from "@/components/notes/note-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TypographyMuted } from "@/components/ui/typography"
import { NOTES } from "@/mock/notes"
import { formatDate } from "@/utils/formatDate"
import { fuzzyMatch } from "@/utils/fuzzyMatch"
import { compareDesc } from "date-fns"
import { StickyNote } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNotes = NOTES.filter((note) =>
    fuzzyMatch(note.title, searchTerm)
  )

  const groupedNotes = filteredNotes.reduce<
    Record<string, typeof filteredNotes>
  >((groups, note) => {
    const dateKey = formatDate(note.updated_at)
    ;(groups[dateKey] ||= []).push(note)
    return groups
  }, {})

  const sortedDates = Object.keys(groupedNotes).sort((a, b) =>
    compareDesc(groupedNotes[a][0].updated_at, groupedNotes[b][0].updated_at)
  )

  return (
    <ScrollArea className="pb-16">
      <main className="w-full flex flex-col h-screen items-center justify-start container mx-auto">
        <div className="flex max-w-[760px] w-full items-center justify-between gap-2">
          <Input
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 h-10  flex-1 my-8 rounded-full"
            placeholder="Search notes..."
          />
          <Button
            asChild
            className="text-white rounded-full cursor-pointer active:scale-[0.98] duration-150 ease-out h-10 !px-4"
          >
            <Link href={`/note/new-note`}>
              <StickyNote size={16} />
              New Note
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-12 h-10">
          {sortedDates.map((date) => (
            <div key={date} className="flex flex-col p-8">
              <div className="flex gap-5 mb-12 items-center justify-start w-full px-2 opacity-70">
                <TypographyMuted>{date}</TypographyMuted>
                <div className="bg-border w-full h-px flex-1" />
              </div>

              <div className="columns-1 sm:columns-2 md:columns-3 gap-8 ">
                {groupedNotes[date].map((note) => (
                  <NoteCard key={note.id} {...note} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </ScrollArea>
  )
}
