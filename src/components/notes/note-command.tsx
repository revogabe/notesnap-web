"use client"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"

import { toast } from "sonner"
import { Note } from "@/types"
import { Plus } from "lucide-react"

import { createUserNote, deleteUserNote } from "@/services/note.service"
import { useDrawerNoteStore } from "@/store/note-drawer"
import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type NoteCommandProps = {
  notes: Note[]
}

export function NoteCommand({ notes }: NoteCommandProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const multiSelectedIdsRef = useRef<Set<string>>(new Set())
  const [multiSelectedIds, setMultiSelectedIds] = useState<Set<string>>(
    new Set()
  )
  const anchorIndexRef = useRef<number | null>(null)

  const setActiveNote = useDrawerNoteStore((state) => state.setActiveNote)

  const filteredNotes = useMemo(() => {
    const items = notes.filter((note) =>
      note.title.toLowerCase().includes(query.toLowerCase())
    )
    return items
  }, [notes, query])

  useEffect(() => {
    if (selectedIndex >= filteredNotes.length) {
      setSelectedIndex(Math.max(0, filteredNotes.length - 1))
    }
  }, [filteredNotes.length, selectedIndex])

  // Clear range selection when dialog closes or query changes
  useEffect(() => {
    if (!open) {
      multiSelectedIdsRef.current = new Set()
      setMultiSelectedIds(new Set())
      anchorIndexRef.current = null
    }
  }, [open, query])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        e.stopPropagation()
        setOpen((open) => !open)
        return
      }

      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        (e.metaKey || e.ctrlKey)
      ) {
        if (!open) return
        e.preventDefault()
        e.stopPropagation()

        let ids: string[]
        const selectedIdsArr = Array.from(multiSelectedIdsRef.current)
        if (selectedIdsArr.length > 0) {
          ids = selectedIdsArr
        } else {
          // delete focused item only
          const activeEl = document.activeElement as HTMLElement | null
          const optionEl = activeEl?.closest(
            '[role="option"][data-note-id]'
          ) as (HTMLElement & { dataset: { noteId?: string } }) | null
          const focusedNoteId = optionEl?.dataset?.noteId
          if (!focusedNoteId) return
          ids = [focusedNoteId]
        }

        const toDelete = filteredNotes.filter((n) =>
          ids.includes(String(n._id))
        )
        if (toDelete.length === 0) return

        Promise.all(toDelete.map((n) => deleteUserNote(String(n._id)))).then(
          () => {
            toast(
              toDelete.length === 1
                ? "Note deleted successfully"
                : `${toDelete.length} notes deleted successfully`
            )
            multiSelectedIdsRef.current = new Set()
            setMultiSelectedIds(new Set())
            anchorIndexRef.current = null
          }
        )
      }

      if (
        open &&
        (e.key === "ArrowDown" || e.key === "ArrowUp") &&
        e.shiftKey
      ) {
        const dir = e.key === "ArrowDown" ? 1 : -1
        const nextIndex = Math.max(
          0,
          Math.min(filteredNotes.length - 1, selectedIndex + dir)
        )
        if (anchorIndexRef.current === null) {
          anchorIndexRef.current = selectedIndex
        }
        const start = Math.min(anchorIndexRef.current, nextIndex)
        const end = Math.max(anchorIndexRef.current, nextIndex)
        const ids = filteredNotes
          .slice(start, end + 1)
          .map((n) => String(n._id))
        const newSet = new Set(ids)
        multiSelectedIdsRef.current = newSet
        setMultiSelectedIds(newSet)
      }

      // If navigating without shift, clear range selection
      if (
        open &&
        (e.key === "ArrowDown" || e.key === "ArrowUp") &&
        !e.shiftKey
      ) {
        anchorIndexRef.current = null
        multiSelectedIdsRef.current = new Set()
        setMultiSelectedIds(new Set())
      }
    }

    window.addEventListener("keydown", down, true)
    return () => window.removeEventListener("keydown", down, true)
  }, [filteredNotes, selectedIndex, open])

  const handleCreateNote = async () => {
    const newNote = await createUserNote(query)
    setActiveNote(newNote)
    setQuery("")
    setOpen(false)
  }

  return (
    <>
      <div className="fixed top-24 left-0 w-full text-center italic font-sans font-semibold space-y-0.5">
        <p className="text-muted-foreground text-sm">
          Press{" "}
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 leading-0 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-sm mt-0.5 mr-0.5">⌘</span>+ K
          </kbd>{" "}
          to open the menu
        </p>
        <span className="text-xs text-muted-foreground">
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 leading-0 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            Space
          </kbd>
          {` and drag to move canvas`}
        </span>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search or create a note..."
        />
        <CommandList>
          <CommandGroup>
            {query !== "" ? (
              <CommandItem value={query} onSelect={handleCreateNote}>
                Create note: <strong>{query}</strong>
              </CommandItem>
            ) : (
              <CommandItem value="newNote" onSelect={handleCreateNote}>
                <Plus className="text-foreground" />
                Create New Note
              </CommandItem>
            )}
          </CommandGroup>

          {filteredNotes && filteredNotes.length > 0 ? (
            <CommandGroup heading="Notes">
              {filteredNotes.map((note, idx) => (
                <CommandItem
                  key={String(note._id)}
                  id={`note-option-${String(note._id)}`}
                  value={`${note.title}-${String(note._id)}`}
                  data-note-id={String(note._id)}
                  onSelect={() => {
                    setActiveNote(note)
                    setOpen(false)
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onFocus={() => setSelectedIndex(idx)}
                  className={cn(
                    "mt-0.5",
                    Array.from(multiSelectedIds).includes(String(note._id)) &&
                      "bg-accent/80"
                  )}
                >
                  <span>{note.title}</span>
                  <CommandShortcut>
                    <span className="font-sans text-muted-foreground mr-0.5 text-[10px]">
                      ⌘
                    </span>{" "}
                    + Del
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
