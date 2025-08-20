import { UploadImage } from "@/components/companion/upload-image"
import { getSimpleNoteById } from "@/services/note.service"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

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
