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
import { useEffect, useMemo, useState } from "react"

type NoteCommandProps = {
  notes: Note[]
}

export function NoteCommand({ notes }: NoteCommandProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const setActiveNote = useDrawerNoteStore((state) => state.setActiveNote)

  const filteredNotes = useMemo(
    () =>
      notes.filter((note) =>
        note.title.toLowerCase().includes(query.toLowerCase())
      ),
    [notes, query]
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "t" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }

      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        (e.metaKey || e.ctrlKey)
      ) {
        const note = filteredNotes[selectedIndex]
        if (note) {
          deleteUserNote(String(note._id)).then((response) => {
            toast(response.message)
          })
        }
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [filteredNotes, selectedIndex])

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
            <span className="text-sm mt-0.5 mr-0.5">⌘</span>+ T
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
                  value={`${note.title}-${String(note._id)}`}
                  onSelect={() => {
                    setActiveNote(note)
                    setOpen(false)
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
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
