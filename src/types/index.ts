export type Notes = {
  id: string
  title: string
  content: string
  tags: string[]
  images: string[]
  companion: {
    visibility: "private" | "public"
    email_allow: string[]
  }
  created_at: string
  updated_at: string
}
