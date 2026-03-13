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

// GET - Fetch all brands
export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
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
    const supabase = createClient(supabaseUrl, supabaseKey)
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

    return NextResponse.json({ 
      data, 
      message: 'Brand added successfully' 
    }, { status: 201 })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

