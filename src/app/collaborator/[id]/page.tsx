import { ScrollArea } from "@/components/ui/scroll-area"
import { getUserNoteById } from "@/services/note.service"
import { EditorBox } from "@/components/tiptap/editor-box"

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const note = await getUserNoteById(id)

  return (
    <main className="w-full flex h-screen items-start justify-between overflow-hidden bg-secondary p-5">
      <EditorBox {...note} />

      <div className="h-full w-full max-w-[500px] bg-background rounded-3xl ring-8 ring-border/15 border border-border ml-8">
        <ScrollArea className="p-4">right</ScrollArea>
      </div>
    </main>
  )
}
