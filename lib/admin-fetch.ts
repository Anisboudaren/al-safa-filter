import { supabase } from '@/lib/supabase'

/**
 * Like fetch(), but attaches `Authorization: Bearer` when a Supabase session exists.
 * Use for admin-only API routes; public routes should use plain fetch.
 */
export async function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession()
  const headers = new Headers(init?.headers)
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`)
  }
  return fetch(input, { ...init, headers })
}
