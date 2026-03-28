import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  getServerSupabaseConfig,
  supabaseMisconfiguredResponse,
} from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin-auth'

// GET - Fetch engines (optionally by brand_id)
export async function GET(request: NextRequest) {
  try {
    const denied = await requireAdmin(request)
    if (denied) return denied

    const cfg = getServerSupabaseConfig()
    if (!cfg) return supabaseMisconfiguredResponse()
    const supabase = createClient(cfg.url, cfg.key)
    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get('brand_id')
    const withBrands = searchParams.get('with_brands') === 'true'

    let query = supabase.from('engines').select(withBrands ? '*, brands(*)' : '*')

    if (brandId) {
      query = query.eq('brand_id', parseInt(brandId))
    }

    query = query.order('name')

    const { data, error } = await query

    if (error) {
      console.error('Error fetching engines:', error)
      return NextResponse.json(
        { error: 'Failed to fetch engines', details: error.message },
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

// POST - Add new engine
export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin(request)
    if (denied) return denied

    const cfg = getServerSupabaseConfig()
    if (!cfg) return supabaseMisconfiguredResponse()
    const supabase = createClient(cfg.url, cfg.key)
    const body = await request.json()
    const { brand_id, name, displacement, fuel_type, technology, power_output } = body

    if (!brand_id || !name) {
      return NextResponse.json(
        { error: 'brand_id and name are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('engines')
      .insert({
        brand_id,
        name,
        displacement: displacement || null,
        fuel_type: fuel_type || null,
        technology: technology || null,
        power_output: power_output || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding engine:', error)
      return NextResponse.json(
        { error: 'Failed to add engine', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        data,
        message: 'Engine added successfully',
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
