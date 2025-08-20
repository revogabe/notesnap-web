process.env.NEXT_PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon"
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/test"

// Ensure Buffer is available in jsdom environment
import { Buffer as NodeBuffer } from "node:buffer"
// @ts-ignore
globalThis.Buffer = globalThis.Buffer || NodeBuffer
