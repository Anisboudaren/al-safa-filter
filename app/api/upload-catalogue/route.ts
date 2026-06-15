import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { requireAdmin } from '@/lib/admin-auth'
import { ensureBlobToken } from '@/lib/blob-client'
import { saveCatalogueSettings } from '@/lib/site-settings'

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin(request)
    if (denied) return denied

    ensureBlobToken()

    const formData = await request.formData()
    const file = formData.get('catalogue') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No catalogue file provided' }, { status: 400 })
    }

    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

    if (!isPdf) {
      return NextResponse.json({ error: 'Catalogue must be a PDF file' }, { status: 400 })
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const blobPath = `catalogue/${safeName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const blob = await put(blobPath, buffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false,
    })

    const settings = await saveCatalogueSettings(blob.url, safeName)

    return NextResponse.json({
      success: true,
      url: blob.url,
      fileName: safeName,
      updatedAt: settings.updatedAt,
      message: 'Catalogue uploaded successfully',
    })
  } catch (error) {
    console.error('Catalogue upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload catalogue',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
