"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu"
import {
  TypographyH4,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography"

import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Note } from "@/types"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns/format"
import { tipTapToText } from "@/utils/tipTapToText"
import { Ellipsis, Lock } from "lucide-react"

import { deleteUserNote } from "@/services/note.service"

export const NoteCard = (note: Note) => {
  const handleDeleteNote = async (e: React.MouseEvent) => {
    if (!note._id) return
    const response = await deleteUserNote(note._id.toString())
    if (response.message) return toast(response.message)
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
          <TypographyH4 className="text-xl font-bold line-clamp-2 font-sans">
            {note.title}
          </TypographyH4>
          <div className="w-full max-h-[310px] overflow-hidden">
            <TypographyP
              className={cn((note.content?.length ?? 0) > 0 && "mt-2 mb-3")}
            >
              {tipTapToText(note.content)}
            </TypographyP>
          </div>

          <div className="flex items-center justify-between w-full">
            <TypographyMuted className="font-semibold font-sans">
              {format(note.updatedAt, "PP")}
            </TypographyMuted>

            <DropdownMenu>
              <DropdownMenuTrigger
                data-stop-open
                className="hover:bg-muted-foreground/25 duration-200 ease-out px-1 h-7 rounded-lg"
              >
                <Ellipsis size={24} className="text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="overflow-hidden" data-stop-open>
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
