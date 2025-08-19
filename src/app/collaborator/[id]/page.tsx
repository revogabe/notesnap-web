import { getUserNoteById } from "@/services/note.service"
import { EditorBox } from "@/components/tiptap/editor-box"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const { id } = await params
  const note = await getUserNoteById(id)

  if (!("companion" in note) || note.companion?.visibility === "private")
    return (
      <main className="w-full flex h-screen items-start justify-between overflow-hidden bg-secondary p-5">
        You do not have access to this note.
      </main>
    )

  return (
    <main className="w-full flex h-screen items-start justify-between overflow-hidden bg-secondary p-5">
      <EditorBox {...note} />
    </main>
  )
}
