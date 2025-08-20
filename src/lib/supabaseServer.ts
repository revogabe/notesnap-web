import 'server-only'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../../database.types'

export type SupabaseServerClient = SupabaseClient<Database>

export function getSupabaseServer(): SupabaseServerClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    )
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'X-Client-Info': 'notesnap-web/server' } },
  })
}
