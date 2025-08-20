import { vi, describe, it, expect, beforeEach } from "vitest"
import * as noteQueries from "@src/queries/note.queries"

// Hoist a shared mock for auth so importing services doesn't connect to Mongo
const getSession = vi.hoisted(() => vi.fn())
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession } },
}))
import {
  createUserNote,
  updateUserNote,
  deleteUserNote,
  getUserNotes,
  getUserNoteById,
  getSimpleNoteById,
} from "@src/services/note.service"

const mockHeaders = vi.fn()

vi.mock("next/headers", () => ({
  headers: () => mockHeaders(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

describe("note.service", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockHeaders.mockResolvedValue({})
  })

  it("createUserNote throws when unauthorized", async () => {
    getSession.mockResolvedValue(null)
    await expect(createUserNote("t")).rejects.toThrow("Unauthorized")
  })

  it("createUserNote returns note for authorized user", async () => {
    getSession.mockResolvedValue({ user: { id: "u1" } })
    vi.spyOn(noteQueries, "createNewNote").mockResolvedValue({
      _id: "n1",
    } as any)

    const note = await createUserNote("title")
    expect(note).toEqual({ _id: "n1" })
  })

  it("updateUserNote throws when unauthorized", async () => {
    getSession.mockResolvedValue(null)
    await expect(updateUserNote({ _id: "n1" })).rejects.toThrow("Unauthorized")
  })

  it("updateUserNote updates when authorized", async () => {
    getSession.mockResolvedValue({ user: { id: "u1" } })
    vi.spyOn(noteQueries, "updateNote").mockResolvedValue({
      acknowledged: true,
    } as any)

    const result = await updateUserNote({ _id: "n1", title: "x" })
    expect(result).toEqual({ message: "Note updated successfully" })
  })

  it("deleteUserNote deletes when authorized", async () => {
    getSession.mockResolvedValue({ user: { id: "u1" } })
    vi.spyOn(noteQueries, "deleteNote").mockResolvedValue({
      acknowledged: true,
    } as any)

    const result = await deleteUserNote("n1")
    expect(result).toEqual({ message: "Note deleted successfully" })
  })

  it("getUserNotes returns list for authorized user", async () => {
    getSession.mockResolvedValue({ user: { id: "u1" } })
    vi.spyOn(noteQueries, "findNotesByUser").mockResolvedValue([
      { _id: "n1" },
    ] as any)

    const notes = await getUserNotes()
    expect(notes).toEqual([{ _id: "n1" }])
  })

  it("getUserNoteById returns note even without session", async () => {
    getSession.mockResolvedValue(null)
    vi.spyOn(noteQueries, "findNoteById").mockResolvedValue({
      _id: "n1",
    } as any)

    const note = await getUserNoteById("n1")
    expect(note).toEqual({ _id: "n1" })
  })

  it("getSimpleNoteById returns simple fields", async () => {
    vi.spyOn(noteQueries, "findNoteById").mockResolvedValue({
      _id: "n1",
      title: "T",
    } as any)

    const note = await getSimpleNoteById("n1")
    expect(note).toEqual({ _id: "n1", title: "T" })
  })
})
