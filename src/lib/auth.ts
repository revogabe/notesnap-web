import "server-only"
import mongoose from "mongoose"
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

const mongoURI = process.env.DATABASE_URL as string

export async function ensureMongoConnected() {
  if (mongoose.connection.readyState >= 1 && mongoose.connection.db) {
    return
  }
  await mongoose.connect(mongoURI)
}

async function getDb() {
  await ensureMongoConnected()
  return mongoose.connection.db!
}

let authSingleton: ReturnType<typeof betterAuth> | null = null

export async function getAuth() {
  if (authSingleton) return authSingleton
  const db = await getDb()
  authSingleton = betterAuth({
    emailAndPassword: { enabled: true },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
    },
    database: mongodbAdapter(db, {}),
  })
  return authSingleton
}
