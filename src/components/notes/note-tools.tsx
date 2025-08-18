"use client"

import React, { useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Button } from "../ui/button"
import { Camera, Copy, Globe, Lock, Share2 } from "lucide-react"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { usePathname } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"
import { updateUserNote } from "@/services/note.service"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

type NoteToolsProps = {
  noteId: string
  defaultVisibility?: "public" | "private"
  collaborators?: { name: string; avatar?: string | null }[]
}

const host = process.env.NEXT_PUBLIC_HOST
const port = process.env.NEXT_PUBLIC_PORT

const Emojis = ["🍎", "🍇", "🍉", "🍓", "🍑", "🍍", "🥭", "🥑", "🍅", "🥥"]

export const NoteTools = ({
  noteId,
  defaultVisibility,
  collaborators,
}: NoteToolsProps) => {
  const pathname = usePathname()
  const [visibility, setVisibility] = React.useState(defaultVisibility)
  const [qrUrl, setQrUrl] = React.useState("")

  useEffect(() => {
    if (noteId) setQrUrl(`${host}${port ? `:${port}` : ""}/companion/${noteId}`)
  }, [noteId])

  const handleQrCodeLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigator.clipboard.writeText(qrUrl)
    toast("QR Code link copied to clipboard!")
  }

  const handleShareLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigator.clipboard.writeText(
      `${host}${port ? `:${port}` : ""}/collaborator/${noteId}`
    )
    toast("Link copied to clipboard!")
  }

  const handleToogleVisibility = async (visibility: "public" | "private") => {
    setVisibility(visibility)
    await updateUserNote({
      _id: noteId,
      companion: {
        visibility,
        emailAllow: [],
      },
    })
  }

  return (
    <div className="rounded-full bg-secondary absolute top-5 right-5 py-2 border border-border ring-4 ring-muted/50 z-50 px-3 gap-2 flex items-center justify-center">
      {/* Avatar Group */}
      <div className="flex -space-x-2  h-max">
        {collaborators &&
          collaborators.map((c, idx) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar
                  key={idx}
                  className="size-6 cursor-default hover:scale-[1.10] duration-200 ease-out ring-2 ring-background"
                >
                  <AvatarImage src={c.avatar ?? ""} alt={c.name ?? "User"} />
                  <AvatarFallback>{Emojis[idx % Emojis.length]}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{c.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
      </div>

      {!pathname.includes("/collaborator") && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 gap-2 rounded-full">
              <Globe size={20} />
              Visibility
            </Button>
          </PopoverTrigger>
          <PopoverContent className="rounded-2xl">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="leading-none font-medium">Change Visibility</h4>
                <p className="text-muted-foreground text-sm">
                  You can share it with friends or turn super secret mode on to
                  keep it private.
                </p>
              </div>
              <div className="flex items-center gap-4 w-full">
                <Label htmlFor="visibility" className="w-full">
                  Visibility
                </Label>
                <Select
                  value={visibility}
                  onValueChange={(value) =>
                    handleToogleVisibility(value as "public" | "private")
                  }
                >
                  <SelectTrigger className="w-full max-w-[180px] rounded-xl">
                    <SelectValue placeholder="Change Visibility" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl w-full max-w-[180px]">
                    <SelectGroup>
                      <SelectItem className="rounded-lg" value="private">
                        <Lock size={16} />
                        Private
                      </SelectItem>
                      <SelectItem className="rounded-lg" value="public">
                        <Globe size={16} />
                        Public
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleShareLink}
                disabled={visibility === "private"}
                className="w-full rounded-xl"
              >
                <Share2 size={20} />
                Share
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button className="h-8 gap-2 rounded-full active:scale-[0.98] duration-200 ease-out cursor-pointer">
            <Camera size={20} />
            Snap
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-2xl">
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
