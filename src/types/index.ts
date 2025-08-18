import * as Y from "yjs"
import { INote } from "@/models/note.model"
import TiptapCollabProvider from "@tiptap-pro/provider"

export type Note = Pick<
  INote,
  | "_id"
  | "title"
  | "content"
  | "tags"
  | "images"
  | "userId"
  | "companion"
  | "createdAt"
  | "updatedAt"
>

export type CollabEditor = {
  provider?: TiptapCollabProvider | null
  room?: string | null
  document?: Y.Doc | null
}
