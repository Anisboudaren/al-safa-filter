import { timingSafeEqual } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function timingSafeCompare(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8')
  const bb = Buffer.from(b, 'utf8')
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

/**
 * Admin API access: either `x-api-key` matches ADMIN_API_KEY (scripts/cron),
 * or `Authorization: Bearer <access_token>` is a valid Supabase user JWT (dashboard).
 */
export async function requireAdmin(
  request: NextRequest
): Promise<NextResponse | null> {
  const adminKey = process.env.ADMIN_API_KEY
  const headerKey = request.headers.get('x-api-key')
  if (adminKey && headerKey && timingSafeCompare(headerKey, adminKey)) {
    return null
  }

  const auth = request.headers.get('authorization')
  const token =
    auth?.startsWith('Bearer ') ? auth.slice(7).trim() : null
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY

  if (!url || !anon) {
    return NextResponse.json(
      { error: 'Supabase auth is not configured' },
      { status: 503 }
    )
  }

  const supabase = createClient(url, anon)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}

/** Public GET /api/compatibility when product_id is a valid positive integer. */
export function isPublicProductCompatibilityRead(request: NextRequest): boolean {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get('product_id')
  if (raw == null || raw === '') return false
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 && String(n) === raw.trim()
}
