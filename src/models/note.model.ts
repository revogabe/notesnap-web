import mongoose, { Schema, model, Types, Document } from "mongoose"

export interface INote extends Document {
  title: string
  content?: string
  tags: string[]
  images: string[]
  userId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: false },
  tags: [String],
  images: [String],
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const NoteModel =
  mongoose.models.Note || model<INote>("Note", NoteSchema)
