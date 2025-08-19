import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "NoteSnap - Manage Your Notes Seamlessly",
  description: "Effortlessly manage your notes with NoteSnap",
}

const font = Nunito({ subsets: ["latin"], variable: "--font-nunito" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${font.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
