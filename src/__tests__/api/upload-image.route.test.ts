import { describe, it, expect, vi, beforeEach } from "vitest"
vi.mock("@/lib/supabaseServer", () => {
  const upload = vi.fn().mockResolvedValue({ data: { path: "p" }, error: null })
  const getPublicUrl = vi
    .fn()
    .mockReturnValue({ data: { publicUrl: "http://u" } })
  const insert = vi.fn().mockResolvedValue({ error: null })
  return {
    getSupabaseServer: () => ({
      storage: {
        from: () => ({ upload, getPublicUrl }),
      },
      from: () => ({ insert }),
    }),
  }
})

vi.mock("@/queries/note.queries", () => ({
  findNoteById: vi.fn().mockResolvedValue({ _id: "n1" }),
}))

// Avoid connecting to Mongo during route tests
vi.mock("@/lib/auth", () => ({
  ensureMongoConnected: vi.fn(),
}))

function makeRequest(body: any) {
  return {
    json: async () => body,
  } as any
}

describe("POST /api/upload-image", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 403 if note not found", async () => {
    const queries = await import("@/queries/note.queries")
    vi.spyOn(queries, "findNoteById").mockResolvedValueOnce(null as any)

    const { POST } = await import("@src/app/api/upload-image/route")
    const res: any = await POST(
      makeRequest({ noteId: "x", fileBase64: "", fileName: "a.jpg" })
    )
    expect(res.status).toBe(403)
  })

  it("uploads, stores db record and returns url", async () => {
    const queries = await import("@/queries/note.queries")
    ;(queries.findNoteById as any).mockResolvedValue({ _id: "n1" })
    const { POST } = await import("@src/app/api/upload-image/route")
    const res: any = await POST(
      makeRequest({
        noteId: "n1",
        fileBase64: Buffer.from("abc").toString("base64"),
        fileName: "a.jpg",
      })
    )

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({ fileUrl: "http://u" })
  })

  it("handles supabase errors gracefully", async () => {
    const supa = await import("@/lib/supabaseServer")
    // @ts-ignore
    supa.getSupabaseServer = () => ({
      storage: {
        from: () => ({
          upload: vi
            .fn()
            .mockResolvedValue({ data: null, error: new Error("x") }),
          getPublicUrl: vi.fn(),
        }),
      },
      from: () => ({}),
    })

    const queries = await import("@/queries/note.queries")
    ;(queries.findNoteById as any).mockResolvedValue({ _id: "n1" })
    const { POST } = await import("@src/app/api/upload-image/route")
    const res: any = await POST(
      makeRequest({
        noteId: "n1",
        fileBase64: Buffer.from("abc").toString("base64"),
        fileName: "a.jpg",
      })
    )

    expect(res.status).toBe(500)
  })
})
