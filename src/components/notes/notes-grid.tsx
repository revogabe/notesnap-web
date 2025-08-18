import { NoteCard } from "./note-card"
import { getUserNotes } from "@/services/note.service"
import { Note } from "@/types"

export const NotesGrid = async () => {
  const notes = await getUserNotes()

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-8 ">
      {notes.map((note: Note) => {
        return <NoteCard key={`${note.title}-${note.updatedAt}`} {...note} />
      })}
    </div>
  )
}
