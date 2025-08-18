import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NewNoteButton } from "@/components/notes/new-note"
import { NotesGrid } from "@/components/notes/notes-grid"

export default async function NotesPage() {
  return (
    <ScrollArea className="pb-16">
      <main className="w-full flex flex-col h-screen items-center justify-start container mx-auto">
        <div className="flex max-w-[760px] w-full items-center justify-between gap-2 px-4">
          <Input
            id="search"
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 h-10  flex-1 my-8 rounded-full"
            placeholder="Search notes..."
          />
          <NewNoteButton />
        </div>

        <div className="flex flex-col gap-12 h-10 max-md:w-full">
          <NotesGrid />
        </div>
      </main>
    </ScrollArea>
  )
}
