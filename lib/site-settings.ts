import { list, put } from '@vercel/blob'
import { ensureBlobToken } from '@/lib/blob-client'

export const DEFAULT_CATALOGUE_PDF_URL =
  'https://uq2n5vkavyhuooys.public.blob.vercel-storage.com/catalogue/CATALOGUE%202025%20%20.pdf'

const SETTINGS_PATH = 'settings/site.json'

export type SiteSettings = {
  cataloguePdfUrl: string
  catalogueFileName?: string
  updatedAt: string
}

const defaultSettings = (): SiteSettings => ({
  cataloguePdfUrl: DEFAULT_CATALOGUE_PDF_URL,
  updatedAt: '',
})

export async function getSiteSettings(): Promise<SiteSettings> {
  ensureBlobToken()

  try {
    const { blobs } = await list({ prefix: 'settings/site.json', limit: 1 })
    const settingsBlob = blobs.find((blob) => blob.pathname === SETTINGS_PATH)
    if (!settingsBlob) {
      return defaultSettings()
    }

    const response = await fetch(settingsBlob.url, { cache: 'no-store' })
    if (!response.ok) {
      return defaultSettings()
    }

    const data = (await response.json()) as Partial<SiteSettings>
    if (!data.cataloguePdfUrl) {
      return defaultSettings()
    }

    return {
      cataloguePdfUrl: data.cataloguePdfUrl,
      catalogueFileName: data.catalogueFileName,
      updatedAt: data.updatedAt || '',
    }
  } catch {
    return defaultSettings()
  }
}

export async function saveCatalogueSettings(cataloguePdfUrl: string, catalogueFileName: string) {
  ensureBlobToken()

  const settings: SiteSettings = {
    cataloguePdfUrl,
    catalogueFileName,
    updatedAt: new Date().toISOString(),
  }

  await put(SETTINGS_PATH, JSON.stringify(settings), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })

  return settings
}
