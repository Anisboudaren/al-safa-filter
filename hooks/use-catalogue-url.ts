"use client"

import { useEffect, useState } from 'react'
import { DEFAULT_CATALOGUE_PDF_URL } from '@/lib/site-settings'

export function useCatalogueUrl() {
  const [catalogueUrl, setCatalogueUrl] = useState(DEFAULT_CATALOGUE_PDF_URL)

  useEffect(() => {
    let cancelled = false

    fetch('/api/catalogue')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data?.cataloguePdfUrl) {
          setCatalogueUrl(data.cataloguePdfUrl)
        }
      })
      .catch(() => {
        // Keep default URL on failure.
      })

    return () => {
      cancelled = true
    }
  }, [])

  return catalogueUrl
}
