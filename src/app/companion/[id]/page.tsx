import { UploadImage } from "@/components/companion/upload-image"
import { getSimpleNoteById, getUserNoteById } from "@/services/note.service"

export default async function CompanionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const note = await getSimpleNoteById(id)

  if (!note) {
    return <div>Note not found</div>
  }

  return <UploadImage _id={String(note._id)} title={note.title} />
}
