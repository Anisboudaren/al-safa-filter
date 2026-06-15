// Utility functions for handling product images

const LEGACY_IMAGE_BASE_URL = 'https://devlly.net/alsafa'

export function getProductImageSrc(
  alsafa: string | null | undefined,
  imageUrl?: string | null,
): string {
  if (imageUrl) return imageUrl
  if (!alsafa) return ''

  const cleanAlsafa = alsafa.replace(/-/g, '')
  return `${LEGACY_IMAGE_BASE_URL}/${cleanAlsafa}.avif`
}

export function getProductImageUrl(alsafa: string | null, filtrationSystem: string): string | null {
  if (!alsafa) return null

  const cleanAlsafa = alsafa.replace(/\s+/g, '').toUpperCase()

  let folder = ''

  if (filtrationSystem === 'air') {
    if (cleanAlsafa.startsWith('FA-') || cleanAlsafa.startsWith('FAP') || cleanAlsafa.startsWith('FPL')) {
      folder = 'FAP'
    }
  } else if (filtrationSystem === 'gasoil') {
    if (cleanAlsafa.startsWith('GBS-')) {
      folder = 'GBS'
    }
  } else if (filtrationSystem === 'huile') {
    if (cleanAlsafa.startsWith('OBS-')) {
      folder = 'OBS'
    }
  }

  if (!folder) return null

  const possibleNames = [
    cleanAlsafa.replace('-', ''),
    cleanAlsafa.replace('-', ' '),
    cleanAlsafa,
  ]

  const extensions = ['.jpg', '.jpeg', '.png', '.webp']

  for (const name of possibleNames) {
    for (const ext of extensions) {
      return `/images/${folder}/${name}${ext}`
    }
  }

  return null
}

export function getProductImageUrlWithFallback(
  alsafa: string | null,
  _filtrationSystem: string,
  existingImageUrl?: string | null,
): string | null {
  const src = getProductImageSrc(alsafa, existingImageUrl)
  return src || null
}

export async function checkImageExists(imagePath: string): Promise<boolean> {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}
