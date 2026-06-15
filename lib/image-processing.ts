import sharp from 'sharp'
import { put } from '@vercel/blob'
import { ensureBlobToken } from '@/lib/blob-client'

export const PRODUCT_IMAGE_MAX_SIZE = 1200
export const PRODUCT_IMAGE_QUALITY = 88

export async function uploadProcessedProductImage(
  imageBuffer: Buffer,
  baseFileName: string,
  originalContentType: string,
  originalExtension?: string,
): Promise<string> {
  ensureBlobToken()

  try {
    const avifBuffer = await sharp(imageBuffer)
      .resize(PRODUCT_IMAGE_MAX_SIZE, PRODUCT_IMAGE_MAX_SIZE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .avif({ quality: PRODUCT_IMAGE_QUALITY })
      .toBuffer()

    const blob = await put(`${baseFileName}.avif`, avifBuffer, {
      access: 'public',
      contentType: 'image/avif',
    })

    return blob.url
  } catch {
    try {
      const webpBuffer = await sharp(imageBuffer)
        .resize(PRODUCT_IMAGE_MAX_SIZE, PRODUCT_IMAGE_MAX_SIZE, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: PRODUCT_IMAGE_QUALITY })
        .toBuffer()

      const blob = await put(`${baseFileName}.webp`, webpBuffer, {
        access: 'public',
        contentType: 'image/webp',
      })

      return blob.url
    } catch {
      const extension = originalExtension || originalContentType.split('/')[1] || 'jpg'
      const blob = await put(`${baseFileName}.${extension}`, imageBuffer, {
        access: 'public',
        contentType: originalContentType,
      })

      return blob.url
    }
  }
}
