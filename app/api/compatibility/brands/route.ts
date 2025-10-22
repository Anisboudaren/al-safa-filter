import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qbpgclcndalyzflariuv.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGdjbGNuZGFseXpmbGFyaXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE3NDAsImV4cCI6MjA3MDA0Nzc0MH0.eZlhQh-FO4ndlTQu8LZpwyvs6DAr4EAWn71DX9278Mw'

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

