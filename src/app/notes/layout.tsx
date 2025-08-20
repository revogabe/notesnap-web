import { getAuth } from "@/lib/auth"
import { headers } from "next/headers"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "NoteSnap - Your Notes",
  description: "Manage and organize your notes with NoteSnap",
}

export default async function NoteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const auth = await getAuth()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  return <>{children}</>
}
