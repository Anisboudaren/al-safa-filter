import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_KEY ??
  process.env.SUPABSE_KEY

if (!supabaseUrl) {
  throw new Error('Supabase URL is not configured')
}

if (!supabaseKey) {
  throw new Error('Supabase key is not configured')
}

// GET - Fetch vehicles (optionally by engine_ids)
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { searchParams } = new URL(request.url)
    const engineIds = searchParams.get('engine_ids')

    let query = supabase.from('vehicles').select('*')

    if (engineIds) {
      const engineIdArray = engineIds.split(',').map(id => parseInt(id.trim()))
      query = query.in('engine_id', engineIdArray)
    }

    query = query.order('model_name')

    const { data, error } = await query

    if (error) {
      console.error('Error fetching vehicles:', error)
      return NextResponse.json(
        { error: 'Failed to fetch vehicles', details: error.message },
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

// POST - Add new vehicle(s)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await request.json()
    const { 
      engine_ids, 
      model_name, 
      body_style, 
      variant, 
      drive_type, 
      year_from, 
      year_to 
    } = body

    if (!engine_ids || !Array.isArray(engine_ids) || engine_ids.length === 0 || !model_name) {
      return NextResponse.json(
        { error: 'engine_ids (array) and model_name are required' },
        { status: 400 }
      )
    }

    // Create vehicle for each engine
    const vehicles = engine_ids.map(engine_id => ({
      engine_id,
      model_name,
      body_style: body_style || null,
      variant: variant || null,
      drive_type: drive_type || null,
      year_from: year_from ? parseInt(year_from) : null,
      year_to: year_to ? parseInt(year_to) : null
    }))

    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicles)
      .select()

    if (error) {
      console.error('Error adding vehicles:', error)
      return NextResponse.json(
        { error: 'Failed to add vehicles', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      data, 
      message: `Vehicle added to ${engine_ids.length} engine${engine_ids.length === 1 ? '' : 's'} successfully` 
    }, { status: 201 })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

