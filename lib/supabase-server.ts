import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/** Read at request time — avoids throwing during `next build` when env is missing on the builder. */
export function getServerSupabaseConfig(): { url: string; key: string } | null {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_KEY

  if (!url || !key) return null
  return { url, key }
}

export function createServerSupabaseClient(): SupabaseClient {
  const cfg = getServerSupabaseConfig()
  if (!cfg) {
    throw new Error('Supabase is not configured')
  }
  return createClient(cfg.url, cfg.key)
}

export function supabaseMisconfiguredResponse() {
  return NextResponse.json(
    { error: 'Supabase is not configured' },
    { status: 503 }
  )
}
