"use client"

import { Button } from "@/components/ui/button"
import { createUserNote } from "@/services/note.service"
import { StickyNote } from "lucide-react"
import { useRouter } from "next/navigation"

export const NewNoteButton = () => {
  const router = useRouter()

  return (
    <Button
      onClick={async () => {
        const note = await createUserNote()
        if (note.id) return router.push(`/notes/${note.id}`)
      }}
      className="text-white rounded-full cursor-pointer active:scale-[0.98] duration-150 ease-out h-10 !px-4"
    >
      <StickyNote size={16} />
      New Note
    </Button>
  )
}
