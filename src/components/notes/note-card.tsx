"use client"

import {
  TypographyH4,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns/format"
import { cn } from "@/lib/utils"
import { Ellipsis, Lock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../ui/context-menu"

import { toast } from "sonner"
import { deleteUserNote, updateUserNote } from "@/services/note.service"
import { Note } from "@/types"
import { tipTapToText } from "@/utils/tipTapToText"
import { motion } from "motion/react"

const host = process.env.NEXT_PUBLIC_HOST
const port = process.env.NEXT_PUBLIC_PORT

export const NoteCard = (note: Note) => {
  const handleDeleteNote = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!note._id) return
    const response = await deleteUserNote(note._id.toString())
    if (response.message) return toast(response.message)
  }

  const handleShareLink = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    navigator.clipboard.writeText(
      `${host}${port ? `:${port}` : ""}/collaborator/${note._id}`
    )
    toast("Link copied to clipboard!")
  }

  const handleToogleVisibility = async (visibility: "public" | "private") => {
    const response = await updateUserNote({
      _id: String(note._id),
      companion: {
        visibility,
        emailAllow: note.companion?.emailAllow ?? [],
      },
    })
    toast(response.message)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
          className={cn(
            "mb-8 break-inside-avoid relative select-none",
            "flex flex-col p-5 border border-border rounded-3xl w-[300px]",
            "hover:opacity-70 duration-200 !transition-all ease-out active:scale-[0.98] cursor-pointer bg-background hover:bg-muted",
            "shadow-lg shadow-black/5",
            "ring-4 ring-muted",
            "bg-gradient-to-t from-white to-muted"
          )}
        >
          {note.companion?.visibility === "private" && (
            <Lock
              size={20}
              className="text-muted-foreground opacity-80 absolute top-5 right-5"
            />
          )}
          {note.tags.length > 0 && (
            <div className="flex gap-1.5 mb-2 flex-wrap">
              {note.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="text-white bg-purple-700 rounded-full text-xs font-bold capitalize"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <TypographyH4 className="text-xl font-bold line-clamp-2">
            {note.title}
          </TypographyH4>
          <div className="w-full max-h-[310px] overflow-hidden">
            <TypographyP
              className={cn((note.content?.length ?? 0) > 0 && "mt-2 mb-3")}
            >
              {tipTapToText(note.content)}
            </TypographyP>
          </div>

          <div className="mt-1 flex items-center justify-between w-full">
            <TypographyMuted className="font-semibold">
              {format(note.updatedAt, "PP")}
            </TypographyMuted>

            <DropdownMenu>
              <DropdownMenuTrigger
                data-stop-open
                // impedir que clique no trigger abra o drawer
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-muted-foreground/25 duration-200 ease-out px-1 h-7 rounded-lg"
              >
                <Ellipsis size={24} className="text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="overflow-hidden" data-stop-open>
                <DropdownMenuItem
                  data-stop-open
                  onClick={handleShareLink}
                  disabled={note.companion?.visibility === "private"}
                >
                  Share Link
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger data-stop-open>
                    Visibility
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent data-stop-open>
                    <DropdownMenuCheckboxItem
                      data-stop-open
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        handleToogleVisibility("public")
                      }}
                      checked={note.companion?.visibility === "public"}
                    >
                      Public
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      data-stop-open
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        handleToogleVisibility("private")
                      }}
                      checked={note.companion?.visibility === "private"}
                    >
                      Private
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem
                  data-stop-open
                  onClick={handleDeleteNote}
                  variant="destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      </ContextMenuTrigger>

      {/* Context menu (clique direito) - por segurança, também marcamos */}
      <ContextMenuContent className="overflow-hidden" data-stop-open>
        <ContextMenuItem data-stop-open onClick={handleShareLink as any}>
          Share Link
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger data-stop-open>
            Visibility
          </ContextMenuSubTrigger>
          <ContextMenuSubContent data-stop-open>
            <ContextMenuCheckboxItem
              data-stop-open
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handleToogleVisibility("public")
              }}
              checked={note.companion?.visibility === "public"}
            >
              Public
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              data-stop-open
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handleToogleVisibility("private")
              }}
              checked={note.companion?.visibility === "private"}
            >
              Private
            </ContextMenuCheckboxItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem
          data-stop-open
          onClick={handleDeleteNote}
          variant="destructive"
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
