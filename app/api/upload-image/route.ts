import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

// Create Supabase client for database operations
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

const supabase = createClient(supabaseUrl, supabaseKey)

// Set the Vercel Blob token
process.env.BLOB_READ_WRITE_TOKEN = process.env.Alsafa_READ_WRITE_TOKEN

export async function POST(request: NextRequest) {
  try {
    console.log('Starting image upload process...')
    
    const formData = await request.formData()
    const file = formData.get('image') as File
    const productId = formData.get('productId') as string

    console.log('File received:', file?.name, 'Size:', file?.size, 'Type:', file?.type)
    console.log('Product ID:', productId)

    if (!file) {
      console.log('No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!productId) {
      console.log('No product ID provided')
      return NextResponse.json({ error: 'No product ID provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type)
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const imageBuffer = Buffer.from(buffer)

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/\.[^/.]+$/, '')
    const baseFileName = `products/${productId}_${originalName}_${timestamp}`

    let imageUrl = ''

    // Try AVIF first
    try {
      console.log('Converting to AVIF...')
      const avifBuffer = await sharp(imageBuffer)
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .avif({ quality: 80 })
        .toBuffer()

      const avifFileName = `${baseFileName}.avif`
      console.log('Uploading AVIF to Vercel Blob:', avifFileName)
      
      const blob = await put(avifFileName, avifBuffer, {
        access: 'public',
        contentType: 'image/avif'
      })

      imageUrl = blob.url
      console.log('AVIF uploaded successfully:', imageUrl)
      
    } catch (avifErr) {
      console.log('AVIF conversion failed, trying WebP:', avifErr)
      
      // Fallback to WebP
      try {
        const webpBuffer = await sharp(imageBuffer)
          .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer()

        const webpFileName = `${baseFileName}.webp`
        console.log('Uploading WebP to Vercel Blob:', webpFileName)
        
        const blob = await put(webpFileName, webpBuffer, {
          access: 'public',
          contentType: 'image/webp'
        })

        imageUrl = blob.url
        console.log('WebP uploaded successfully:', imageUrl)
        
      } catch (webpErr) {
        console.log('WebP conversion failed, using original:', webpErr)
        
        // Final fallback - store original image
        const originalFileName = `${baseFileName}.${file.name.split('.').pop()}`
        console.log('Uploading original to Vercel Blob:', originalFileName)
        
        const blob = await put(originalFileName, imageBuffer, {
          access: 'public',
          contentType: file.type
        })

        imageUrl = blob.url
        console.log('Original uploaded successfully:', imageUrl)
      }
    }

    // Update product with image URL
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
      message: 'Image uploaded and processed successfully'
    })

  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
