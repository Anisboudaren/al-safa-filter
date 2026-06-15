import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/site-settings'

export async function GET() {
  const settings = await getSiteSettings()

  return NextResponse.json(
    {
      cataloguePdfUrl: settings.cataloguePdfUrl,
      catalogueFileName: settings.catalogueFileName,
      updatedAt: settings.updatedAt,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    },
  )
}
