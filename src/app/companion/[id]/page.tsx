"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import axios from "axios"

export default function CompanionPage() {
  const params = useParams()
  const noteId = params.id
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    const channel = supabase
      .channel(`note-images-${noteId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "note_images",
          filter: `note_id=eq.${noteId}`,
        },
        (payload) => {
          setImages((prev) => [...prev, payload.new.file_url])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [noteId])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]
    const fileBase64 = await fileToBase64(file)
    await axios.post("/api/upload-image", {
      noteId,
      fileBase64,
      fileName: file.name,
    })
  }

  return (
    <div className="p-4">
      <h2 className="font-bold mb-4">Upload Image</h2>
      <input type="file" onChange={handleUpload} />
      <div className="mt-4 grid grid-cols-2 gap-2">
        {images.map((img) => (
          <img
            key={img}
            src={img}
            alt="Note Image"
            className="w-full rounded-lg"
          />
        ))}
      </div>
    </div>
  )
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve((reader.result as string).split(",")[1])
    reader.onerror = (error) => reject(error)
  })
}
