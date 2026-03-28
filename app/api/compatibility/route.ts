import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  getServerSupabaseConfig,
  supabaseMisconfiguredResponse,
} from '@/lib/supabase-server'
import {
  isPublicProductCompatibilityRead,
  requireAdmin,
} from '@/lib/admin-auth'

// GET - Fetch all compatibilities or by product_id (public only when product_id is set)
export async function GET(request: NextRequest) {
  try {
    if (!isPublicProductCompatibilityRead(request)) {
      const denied = await requireAdmin(request)
      if (denied) return denied
    }

    const cfg = getServerSupabaseConfig()
    if (!cfg) return supabaseMisconfiguredResponse()
    const supabase = createClient(cfg.url, cfg.key)
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product_id')

    let query = supabase.from('product_compatibilities').select(`
        *,
        vehicles (
          *,
          engines (
            *,
            brands (*)
          )
        )
      `)

    if (productId) {
      query = query.eq('product_id', parseInt(productId))
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching compatibilities:', error)
      return NextResponse.json(
        { error: 'Failed to fetch compatibilities', details: error.message },
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

// POST - Add new compatibilities
export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin(request)
    if (denied) return denied

    const cfg = getServerSupabaseConfig()
    if (!cfg) return supabaseMisconfiguredResponse()
    const supabase = createClient(cfg.url, cfg.key)
    const body = await request.json()
    const { product_id, vehicle_ids } = body

    if (!product_id || !vehicle_ids || !Array.isArray(vehicle_ids)) {
      return NextResponse.json(
        { error: 'Invalid request. Required: product_id and vehicle_ids array' },
        { status: 400 }
      )
    }

    // Create compatibility records
    const compatibilities = vehicle_ids.map((vehicle_id: number) => ({
      product_id,
      vehicle_id,
    }))

    const { data, error } = await supabase
      .from('product_compatibilities')
      .insert(compatibilities)
      .select()

    if (error) {
      console.error('Error adding compatibilities:', error)
      return NextResponse.json(
        { error: 'Failed to add compatibilities', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        data,
        message: `Successfully added ${data.length} compatibilit${data.length === 1 ? 'y' : 'ies'}`,
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

// DELETE - Remove a compatibility
export async function DELETE(request: NextRequest) {
  try {
    const denied = await requireAdmin(request)
    if (denied) return denied

    const cfg = getServerSupabaseConfig()
    if (!cfg) return supabaseMisconfiguredResponse()
    const supabase = createClient(cfg.url, cfg.key)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Compatibility ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('product_compatibilities')
      .delete()
      .eq('id', parseInt(id))

    if (error) {
      console.error('Error deleting compatibility:', error)
      return NextResponse.json(
        { error: 'Failed to delete compatibility', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Compatibility deleted successfully',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
