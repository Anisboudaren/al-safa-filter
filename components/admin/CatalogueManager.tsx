"use client"

import { useEffect, useRef, useState } from 'react'
import { adminFetch } from '@/lib/admin-fetch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, FileText, Loader2, Upload } from 'lucide-react'
import { DEFAULT_CATALOGUE_PDF_URL } from '@/lib/site-settings'

export function CatalogueManager() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [catalogueUrl, setCatalogueUrl] = useState(DEFAULT_CATALOGUE_PDF_URL)
  const [fileName, setFileName] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadCatalogue = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/catalogue')
      if (!response.ok) {
        throw new Error('Failed to load catalogue settings')
      }

      const data = await response.json()
      setCatalogueUrl(data.cataloguePdfUrl || DEFAULT_CATALOGUE_PDF_URL)
      setFileName(data.catalogueFileName || '')
      setUpdatedAt(data.updatedAt || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load catalogue settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCatalogue()
  }, [])

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('catalogue', file)

      const response = await adminFetch('/api/upload-catalogue', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setCatalogueUrl(data.url)
      setFileName(data.fileName || file.name)
      setUpdatedAt(data.updatedAt || new Date().toISOString())
      setSuccess('Catalogue uploaded successfully. The site will use the new PDF link.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-500" />
          Catalogue PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-sm">
          Upload a new catalogue PDF to Vercel Blob. The download button in the header and footer
          will use this file automatically.
        </p>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading current catalogue...
          </div>
        ) : (
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 space-y-2">
            <p className="text-sm text-gray-400">Current file</p>
            <p className="text-white font-medium break-all">
              {fileName || 'Default catalogue PDF'}
            </p>
            {updatedAt && (
              <p className="text-xs text-gray-500">
                Last updated: {new Date(updatedAt).toLocaleString()}
              </p>
            )}
            <a
              href={catalogueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm"
            >
              <Download className="h-4 w-4" />
              Preview current catalogue
            </a>
          </div>
        )}

        {error && (
          <Alert className="bg-red-900/30 border-red-700">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-900/30 border-green-700">
            <AlertDescription className="text-green-200">{success}</AlertDescription>
          </Alert>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handleUpload}
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload new catalogue PDF
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
