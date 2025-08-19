import mongoose from "mongoose"
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

const mongoURI = process.env.DATABASE_URL as string

async function getDb() {
  if (mongoose.connection.readyState >= 1 && mongoose.connection.db) {
    return mongoose.connection.db
  }

  await mongoose.connect(mongoURI)
  return mongoose.connection.db!
}

export const auth = await (async () => {
  const db = await getDb()
  return betterAuth({
    emailAndPassword: { enabled: true },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
    },
    database: mongodbAdapter(db, {}),
  })
})()
