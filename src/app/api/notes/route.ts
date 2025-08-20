import type { NextRequest } from "next/server"

export async function GET(_req: NextRequest) {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  })
}
