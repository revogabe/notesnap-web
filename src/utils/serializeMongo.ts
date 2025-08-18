import { Types } from "mongoose"

export function serializeMongo<T>(doc: T | T[]): any {
  if (Array.isArray(doc)) return doc.map((d) => serializeMongo(d))

  if (doc === null || doc === undefined) return doc

  if (doc && typeof doc === "object") {
    const serialized: Record<string, any> = {}
    for (const [key, value] of Object.entries(doc)) {
      if (value instanceof Types.ObjectId) {
        serialized[key] = value.toString()
      } else if (value instanceof Date) {
        serialized[key] = value.toISOString()
      } else if (Buffer.isBuffer(value)) {
        // Handle Buffer objects by converting to string or excluding them
        serialized[key] = value.toString("base64") // or skip this property entirely
      } else if (Array.isArray(value)) {
        serialized[key] = value.map((v) => {
          if (v instanceof Types.ObjectId) return v.toString()
          if (v instanceof Date) return v.toISOString()
          if (Buffer.isBuffer(v)) return v.toString("base64")
          if (typeof v === "object" && v !== null) return serializeMongo(v)
          return v
        })
      } else if (typeof value === "object" && value !== null) {
        // Recursively serialize nested objects
        serialized[key] = serializeMongo(value)
      } else {
        serialized[key] = value
      }
    }
    return serialized
  }

  return doc
}
