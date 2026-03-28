import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  getServerSupabaseConfig,
  supabaseMisconfiguredResponse,
} from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin-auth'

// GET - Fetch all brands
export async function GET(request: NextRequest) {
  try {
    const denied = await requireAdmin(request)
    if (denied) return denied

    const cfg = getServerSupabaseConfig()
    if (!cfg) return supabaseMisconfiguredResponse()
    const supabase = createClient(cfg.url, cfg.key)
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('display_name')

    if (error) {
      console.error('Error fetching brands:', error)
      return NextResponse.json(
        { error: 'Failed to fetch brands', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Add new brand
export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin(request)
    if (denied) return denied

    const cfg = getServerSupabaseConfig()
    if (!cfg) return supabaseMisconfiguredResponse()
    const supabase = createClient(cfg.url, cfg.key)
    const body = await request.json()
    const { name, display_name } = body

    if (!name || !display_name) {
      return NextResponse.json(
        { error: 'Name and display_name are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('brands')
      .insert({ name, display_name })
      .select()
      .single()

    if (error) {
      console.error('Error adding brand:', error)
      return NextResponse.json(
        { error: 'Failed to add brand', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        data,
        message: 'Brand added successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
