import { NoteCommand } from "@/components/notes/note-command"
import { NotesClientPage } from "@/components/notes/note-page"
import { getUserNotes } from "@/services/note.service"

export default async function NotesPage() {
  const notes = await getUserNotes()

  return (
    <>
      <NoteCommand notes={notes} />
      <NotesClientPage notes={notes} />
    </>
  )
}
