import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NoteEditor } from './editor'

vi.mock('@/services/note.service', () => ({ updateUserNote: vi.fn().mockResolvedValue({}) }))
vi.mock('@/store/note-store', () => ({ useNoteStore: () => ({ getNote: () => null, setNote: vi.fn() }) }))

const note = { _id: '1', title: 'Test', content: '', createdAt: '', tags: [], images: [], userId: 'u1' }

describe('NoteEditor', () => {
  it('renderiza campo de título e editor', async () => {
    render(<NoteEditor note={note as any} />)
    expect(await screen.findByPlaceholderText(/enter note title/i)).toBeInTheDocument()
  })
})
