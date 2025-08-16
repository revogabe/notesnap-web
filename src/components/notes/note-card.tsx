import type { Notes } from "@/types"
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
import Link from "next/link"

export const NoteCard = (note: Notes) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Link
          href={`/note/${note.id}`}
          className={cn(
            "mb-8 break-inside-avoid relative select-none",
            "flex flex-col p-5 border border-border rounded-4xl max-w-[280px] h-max",
            "hover:opacity-80 duration-200 !transition-all ease-out hover:-translate-y-2 active:scale-[0.98] cursor-pointer bg-background hover:bg-muted",
            "shadow-lg shadow-black/5",
            "ring-4 ring-muted",
            "bg-gradient-to-b from-background to-muted/25"
          )}
        >
          {note.companion.visibility === "private" && (
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
          <div>
            {note.companion.visibility === "private" ? (
              <TypographyP className="blur-[3px] mt-2 mb-3">
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which look even slightly
                believable.
              </TypographyP>
            ) : (
              <TypographyP
                className={cn(note.content.length > 0 && "mt-2 mb-3")}
              >
                {note.content}
              </TypographyP>
            )}
          </div>
          <div className="mt-1 flex items-center justify-between w-full">
            <TypographyMuted className="font-semibold">
              {format(note.updated_at, "PP")}
            </TypographyMuted>

            <DropdownMenu>
              <DropdownMenuTrigger className="hover:bg-muted-foreground/25 duration-200 ease-out px-1 h-7 rounded-lg">
                <Ellipsis size={24} className="text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="overflow-hidden">
                <DropdownMenuItem>Share Link</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Visibility</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuCheckboxItem
                      checked={note.companion.visibility === "public"}
                    >
                      Public
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={note.companion.visibility === "private"}
                    >
                      Private
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent className="overflow-hidden">
        <ContextMenuItem>Share Link</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Visibility</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuCheckboxItem
              checked={note.companion.visibility === "public"}
            >
              Public
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={note.companion.visibility === "private"}
            >
              Private
            </ContextMenuCheckboxItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
