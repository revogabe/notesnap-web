import { getAuth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const GET = async (
  ...args: Parameters<ReturnType<typeof toNextJsHandler>["GET"]>
) => {
  const auth = await getAuth()
  const handlers = toNextJsHandler(auth.handler)
  return handlers.GET(...args)
}

export const POST = async (
  ...args: Parameters<ReturnType<typeof toNextJsHandler>["POST"]>
) => {
  const auth = await getAuth()
  const handlers = toNextJsHandler(auth.handler)
  return handlers.POST(...args)
}
