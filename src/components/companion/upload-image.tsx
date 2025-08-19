"use client"

import axios from "axios"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { TypographyH3, TypographyP } from "../ui/typography"
import { Camera } from "lucide-react"

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve((reader.result as string).split(",")[1])
    reader.onerror = (error) => reject(error)
  })
}

type UploadImageProps = {
  _id: string
  title: string
}

export const UploadImage = (note: UploadImageProps) => {
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    const channel = supabase
      .channel(`note-images-${note._id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "note_images",
          filter: `note_id=eq.${note._id}`,
        },
        (payload) => {
          setImages((prev) => [...prev, payload.new.file_url])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [note._id])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]
    const fileBase64 = await fileToBase64(file)
    await axios.post("/api/upload-image", {
      noteId: note._id,
      fileBase64,
      fileName: file.name,
    })
  }

  return (
    <div className="h-screen p-6 bg-secondary flex flex-col items-center justify-start">
      <div className="flex flex-col items-center justify-center pt-2 pb-4">
        <TypographyH3>{note.title}</TypographyH3>
        <TypographyP>Upload an image for this note</TypographyP>
      </div>

      <label className="overflow-hidden relative mt-4 w-full min-h-[70dvh] overflow-y-auto border border-border rounded-3xl ring-4 ring-muted bg-secondary flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center absolute inset-0">
          <div className="rounded-full flex items-center justify-center bg-muted p-4 opacity-50 border border-border">
            <Camera size={40} className="text-muted-foreground" />
          </div>
          <div className="flex flex-col items-center justify-center pt-2 pb-4">
            <TypographyH3 className="text-muted-foreground">
              Upload Image
            </TypographyH3>
            <TypographyP className="max-w-[70%] text-center">
              Take a photo or choose an image from your device
            </TypographyP>
          </div>
        </div>
        <input type="file" onChange={handleUpload} className="hidden" />

        {/* Masonry Layout */}
        <div className="w-full  grid grid-cols-2 gap-4 justify-start items-start p-8">
          {images.map((img) => (
            <img
              key={img}
              src={img}
              alt="Note Image"
              className="mb-4 w-full rounded-lg break-inside"
            />
          ))}
        </div>
      </label>
    </div>
  )
}

// <h2 className="font-bold mb-4">Upload Image</h2>
//     <input type="file" onChange={handleUpload} />
//     <div className="mt-4 grid grid-cols-2 gap-2">
//       {images.map((img) => (
//         <img
//           key={img}
//           src={img}
//           alt="Note Image"
//           className="w-full rounded-lg"
//         />
//       ))}
//     </div>
