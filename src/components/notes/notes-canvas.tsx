"use client"
import React, { useState, useEffect } from "react"
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Note } from "@/types"
import { NoteCard } from "./note-card"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "../ui/drawer"
import { useNotesPositionStore } from "@/store/note-position-store"
import { NoteContent } from "./note-content"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useDrawerNoteStore } from "@/store/note-drawer"

// ---- Componente Draggable ----
function DraggableNote({
  note,
  x,
  y,
  onCardClick,
  isDragging,
}: {
  note: Note
  x: number
  y: number
  onCardClick: () => void
  isDragging: boolean
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: String(note._id),
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    left: x,
    top: y,
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="absolute cursor-grab active:cursor-grabbing"
      onClick={(e) => {
        if (isDragging) return
        const target = e.target as HTMLElement
        if (target.closest("[data-stop-open]")) return
        onCardClick()
      }}
    >
      <NoteCard {...note} />
    </div>
  )
}

// ---- Canvas ----
export const NotesCanvas: React.FC<{ notes: Note[] }> = ({ notes }) => {
  const { positions, setPosition, initPositions } = useNotesPositionStore()
  const activeNote = useDrawerNoteStore((state) => state.activeNote)
  const setActiveNote = useDrawerNoteStore((state) => state.setActiveNote)

  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    initPositions(notes)
  }, [notes, initPositions])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 0.5 },
    })
  )

  const handleDragStart = (_: DragStartEvent) => {
    setIsDragging(true)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    const pos = positions.find((p) => p.id === active.id)
    if (pos) {
      setPosition(String(active.id), pos.x + delta.x, pos.y + delta.y)
    }
    setIsDragging(false)
  }

  const handleNoteClick = (note: Note) => {
    if (!isDragging) setActiveNote(note)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative w-full h-[80vh] border border-muted rounded-xl bg-muted/10">
        {notes.map((note) => {
          const pos = positions.find((p) => p.id === String(note._id))
          return (
            <DraggableNote
              key={String(note._id)}
              note={note}
              x={pos?.x ?? 0}
              y={pos?.y ?? 0}
              isDragging={isDragging}
              onCardClick={() => handleNoteClick(note)}
            />
          )
        })}
      </div>

      <Drawer open={!!activeNote} onOpenChange={() => setActiveNote(null)}>
        <DrawerContent>
          {activeNote && (
            <>
              <VisuallyHidden>
                <DrawerTitle>{activeNote.title}</DrawerTitle>
                <DrawerDescription>{activeNote.content}</DrawerDescription>
              </VisuallyHidden>
              <NoteContent
                note={activeNote}
                notes={notes}
                onNoteSelect={setActiveNote}
              />
            </>
          )}
        </DrawerContent>
      </Drawer>
    </DndContext>
  )
}
