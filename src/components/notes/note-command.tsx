"use client"

import * as React from "react"
import { Calendar, Smile, Calculator, Plus } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Note } from "@/types"
import { createUserNote, deleteUserNote } from "@/services/note.service"
import { toast } from "sonner"
import { useDrawerNoteStore } from "@/store/note-drawer"

type NoteCommandProps = {
  notes: Note[]
}

export function NoteCommand({ notes }: NoteCommandProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const setActiveNote = useDrawerNoteStore((state) => state.setActiveNote)

  const filteredNotes = React.useMemo(
    () =>
      notes.filter((note) =>
        note.title.toLowerCase().includes(query.toLowerCase())
      ),
    [notes, query]
  )

  React.useEffect(() => {
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
    console.log(newNote)
    setActiveNote(newNote)
    setQuery("")
    setOpen(false)
  }

  return (
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
  )
}
