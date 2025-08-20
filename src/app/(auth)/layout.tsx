import { getAuth } from "@/lib/auth"
import { headers } from "next/headers"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

// Ensure this route tree is always dynamic at runtime and not prerendered
export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

export const metadata: Metadata = {
  title: "NoteSnap - Authentication",
  description: "Authenticate to access your notes",
}

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const auth = await getAuth()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect("/notes")
  }

  return children
}
