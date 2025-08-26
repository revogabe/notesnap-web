"use client"

import "@/app/globals.css"
import axios from "axios"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { TypographyH3, TypographyP } from "../ui/typography"
import { Camera } from "lucide-react"
import { fileToBase64 } from "@/utils/fileToBase64"

type UploadImageProps = {
  _id: string
  title: string
}

export const UploadImage = (note: UploadImageProps) => {
  const [images, setImages] = useState<string[]>([])
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})

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

      <div className="overflow-hidden relative mt-4 w-full min-h-[70dvh] overflow-y-auto border border-border rounded-3xl ring-4 ring-muted bg-secondary flex flex-col items-center justify-start p-4">
        <label className="border border-border rounded-3xl active:scale-95 ease-out duration-300 w-full bg-background/50 flex items-center justify-center px-4 mx-4">
          {/* Placeholder */}
          <div className="flex items-center justify-start gap-4">
            <div className="rounded-full flex items-center justify-center bg-muted p-4 opacity-50 border border-border">
              <Camera size={24} className="text-muted-foreground" />
            </div>
            <div className="flex flex-col items-start justify-center pt-4 pb-4">
              <TypographyH3 className="text-foreground text-base text-left">
                Upload Image
              </TypographyH3>
              <TypographyP className="text-left">
                Take a photo or choose an image from your device
              </TypographyP>
            </div>
          </div>
          <input type="file" onChange={handleUpload} className="hidden" />
        </label>
        <div className="w-full justify-start items-start">
          {images.map((img) => {
            const isLoaded = loaded[img]
            return (
              <div key={img} className="relative w-full">
                <img
                  src={img}
                  loading="lazy"
                  alt="Note Image"
                  onLoad={() => setLoaded((prev) => ({ ...prev, [img]: true }))}
                  className={`mb-5 w-full rounded-lg animate-pulse break-inside ring-4 ring-white border border-border shadow-sm shadow-black/10 ${
                    isLoaded ? "img-loaded" : "img-loading"
                  }`}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
