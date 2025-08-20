import { supabase } from "@/lib/supabase"
import { findNoteById } from "@/queries/note.queries"
import { NextRequest, NextResponse } from "next/server"
import { ensureMongoConnected } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { noteId, path, fileBase64, fileName } = (await req.json()) as
      | {
          noteId: string
          path: string
          fileBase64?: undefined
          fileName?: undefined
        }
      | {
          noteId: string
          path?: undefined
          fileBase64: string
          fileName: string
        }
      | any

    // Ensure DB connection before querying
    await ensureMongoConnected()

    const note = await findNoteById(noteId)
    if (!note)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    let objectPath: string
    if (path) {
      // Already uploaded on client
      objectPath = path
    } else {
      if (!fileBase64 || !fileName) {
        return NextResponse.json({ message: "Invalid body" }, { status: 400 })
      }
      const fileBuffer = Buffer.from(fileBase64, "base64")
      const { data, error } = await supabase.storage
        .from("note-images")
        .upload(`notes/${noteId}/${Date.now()}-${fileName}`, fileBuffer, {
          contentType: "application/octet-stream",
          upsert: false,
        })
      if (error) throw error
      objectPath = data.path
    }

    const publicUrl = supabase.storage
      .from("note-images")
      .getPublicUrl(objectPath).data.publicUrl

    const { error: insertError } = await supabase.from("note_images").insert({
      note_id: noteId,
      file_url: publicUrl,
      created_at: new Date().toISOString(),
    })
    if (insertError) throw insertError

    return NextResponse.json({ fileUrl: publicUrl })
  } catch (err) {
    console.error("/api/upload-image error", err)
    return NextResponse.json({ message: "Upload failed" }, { status: 500 })
  }
}
