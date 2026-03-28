import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { requireAdmin } from '@/lib/admin-auth'

// Set the Vercel Blob token
process.env.BLOB_READ_WRITE_TOKEN = process.env.Alsafa_READ_WRITE_TOKEN

export async function GET(request: NextRequest) {
  try {
    const denied = await requireAdmin(request)
    if (denied) return denied

    console.log('Testing Vercel Blob...')
    console.log('Token available:', !!process.env.BLOB_READ_WRITE_TOKEN)
    
    const testContent = 'Hello from Vercel Blob!'
    const testFileName = `test_${Date.now()}.txt`
    
    const blob = await put(testFileName, testContent, {
      access: 'public',
      contentType: 'text/plain'
    })

    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      message: 'Vercel Blob is working!'
    })

  } catch (error) {
    console.error('Vercel Blob test error:', error)
    return NextResponse.json({ 
      error: 'Vercel Blob test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
