import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  getServerSupabaseConfig,
  supabaseMisconfiguredResponse,
} from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin-auth'
import { uploadProcessedProductImage } from '@/lib/image-processing'

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin(request)
    if (denied) return denied

    const formData = await request.formData()
    const file = formData.get('image') as File
    const productId = formData.get('productId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!productId) {
      return NextResponse.json({ error: 'No product ID provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    const imageBuffer = Buffer.from(await file.arrayBuffer())
    const timestamp = Date.now()
    const originalName = file.name.replace(/\.[^/.]+$/, '')
    const baseFileName = `products/${productId}_${originalName}_${timestamp}`
    const originalExtension = file.name.split('.').pop()

    const imageUrl = await uploadProcessedProductImage(
      imageBuffer,
      baseFileName,
      file.type,
      originalExtension,
    )

    const cfg = getServerSupabaseConfig()
    if (!cfg) return supabaseMisconfiguredResponse()
    const supabase = createClient(cfg.url, cfg.key)

    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: imageUrl })
      .eq('id', productId)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Image uploaded and processed successfully',
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
