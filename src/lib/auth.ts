import "server-only"
import mongoose from "mongoose"
import { MongoClient, Db } from "mongodb"
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

const mongoURI = process.env.DATABASE_URL as string

if (!mongoURI) {
  throw new Error(
    "DATABASE_URL is not set. Please define it in your environment."
  )
}

export async function ensureMongoConnected() {
  if (mongoose.connection.readyState >= 1 && mongoose.connection.db) {
    return
  }
  await mongoose.connect(mongoURI)
}

let nativeMongoClient: MongoClient | null = null
async function getNativeDb(): Promise<Db> {
  if (!nativeMongoClient) {
    nativeMongoClient = new MongoClient(mongoURI)
    await nativeMongoClient.connect()
  }
  return nativeMongoClient.db()
}

let authSingleton: ReturnType<typeof betterAuth> | null = null
let initializingAuthPromise: Promise<ReturnType<typeof betterAuth>> | null =
  null

export async function getAuth() {
  if (authSingleton) return authSingleton
  if (initializingAuthPromise) return initializingAuthPromise

  initializingAuthPromise = (async () => {
    await ensureMongoConnected()
    const db = await getNativeDb()

    const instance = betterAuth({
      emailAndPassword: { enabled: true },
      socialProviders: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID as string,
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
      },
      database: mongodbAdapter(db, {}),
    })
    authSingleton = instance
    initializingAuthPromise = null
    return instance
  })()

  return initializingAuthPromise
}
