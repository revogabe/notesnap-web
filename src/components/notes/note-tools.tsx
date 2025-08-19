"use client"

import * as React from "react"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Button } from "../ui/button"
import { Camera, Copy, Trash } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"
import { PopoverClose } from "@radix-ui/react-popover"
import { deleteUserNote } from "@/services/note.service"
import { HoldToConfirmButton } from "@/components/ui/hold-to-confirm-button"
import { useDrawerNoteStore } from "@/store/note-drawer"

type NoteToolsProps = {
  noteId: string
}

const host = process.env.NEXT_PUBLIC_HOST
const port = process.env.NEXT_PUBLIC_PORT

export const NoteTools = ({ noteId }: NoteToolsProps) => {
  const [qrUrl, setQrUrl] = React.useState("")
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const setActiveNote = useDrawerNoteStore((state) => state.setActiveNote)

  React.useEffect(() => {
    if (noteId) setQrUrl(`${host}${port ? `:${port}` : ""}/companion/${noteId}`)
  }, [noteId])

  const handleQrCodeLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigator.clipboard.writeText(qrUrl)
    toast("QR Code link copied to clipboard!")
  }

  const confirmDelete = React.useCallback(async () => {
    if (!noteId || isDeleting) return
    try {
      setIsDeleting(true)
      const response = await deleteUserNote(noteId)
      toast(response?.message || "Note deleted successfully")
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete note"
      toast(message)
    } finally {
      setIsDeleting(false)
      setDeleteOpen(false)
      setActiveNote(null)
    }
  }, [noteId, isDeleting])

  return (
    <div className="rounded-full bg-secondary absolute top-5 right-8 py-2 border border-border ring-4 ring-muted/50 z-50 px-3 gap-2 flex items-center justify-center">
      <Popover open={deleteOpen} onOpenChange={setDeleteOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-8 gap-2 text-red-500 hover:text-red-700 rounded-full active:scale-[0.98] duration-200 ease-out cursor-pointer"
          >
            <Trash size={20} />
            Delete Note
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-[20px] flex flex-col items-center justify-center w-fit gap-1.5 p-3 relative">
          <div className="space-y-1 my-2 w-full px-2">
            <h4 className="leading-none font-bold text-left">Delete Note</h4>
            <p className="text-muted-foreground text-sm text-left max-w-[200px]">
              Are you sure you want to delete this note?
            </p>
          </div>
          <div className="flex items-center justify-center w-full gap-1.5">
            <PopoverClose asChild>
              <Button className="rounded-xl w-full flex-1" variant="outline">
                Cancel
              </Button>
            </PopoverClose>
            <HoldToConfirmButton
              className="rounded-xl max-w-[140px] shrink-0"
              variant="destructive"
              disabled={isDeleting}
              onConfirm={confirmDelete}
              aria-label="Hold to confirm delete"
            >
              {isDeleting ? "Deleting..." : "Hold to delete"}
            </HoldToConfirmButton>
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="h-8 gap-2 rounded-full active:scale-[0.98] duration-200 ease-out cursor-pointer">
            <Camera size={20} />
            Snap
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-2xl mr-2">
          {qrUrl ? (
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="space-y-2">
                <h4 className="leading-none font-bold text-center">
                  Scan to Sync Note
                </h4>
                <p className="text-muted-foreground text-sm text-center">
                  I scanned this QR from your phone so take a picture and sync
                  it with your note.
                </p>
              </div>
              <QRCodeSVG value={qrUrl} />

              <Button onClick={handleQrCodeLink} className="w-full rounded-xl">
                <Copy size={20} />
                Copy Link
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <h4 className="leading-none font-bold text-center">
                No QR Code Available
              </h4>
              <p className="text-muted-foreground text-sm text-center">
                Please generate a QR code to <br /> sync your note.
              </p>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
