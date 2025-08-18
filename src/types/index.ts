import { INote } from "@/models/note.model"

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
