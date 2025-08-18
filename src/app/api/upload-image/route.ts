import { supabase } from "@/lib/supabase"
import { findNoteById } from "@/queries/note.queries"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { noteId, fileBase64, fileName } = await req.json()

    const note = await findNoteById(noteId)
    if (!note)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    const fileBuffer = Buffer.from(fileBase64, "base64")
    const { data, error } = await supabase.storage
      .from("note-images")
      .upload(`notes/${noteId}/${Date.now()}-${fileName}`, fileBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      })
    if (error) throw error

    const publicUrl = supabase.storage
      .from("note-images")
      .getPublicUrl(data.path).data.publicUrl

    const { error: insertError } = await supabase.from("note_images").insert({
      note_id: noteId,
      file_url: publicUrl,
      created_at: new Date().toISOString(),
    })
    if (insertError) throw insertError

    return NextResponse.json({ fileUrl: publicUrl })
  } catch (err) {
    return NextResponse.json({ message: "Upload failed" }, { status: 500 })
  }
}
