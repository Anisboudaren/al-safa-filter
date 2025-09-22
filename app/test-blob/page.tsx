"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestBlobPage() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testVercelBlob = async () => {
    setTesting(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/test-blob')
      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Test failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Upload className="h-6 w-6 mr-2" />
              Vercel Blob Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              This page tests if Vercel Blob is properly configured and working.
            </p>

            <Button
              onClick={testVercelBlob}
              disabled={testing}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Test Vercel Blob
                </>
              )}
            </Button>

            {error && (
              <Alert className="bg-red-900/20 border-red-800 text-red-200">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="bg-green-900/20 border-green-800 text-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div><strong>Status:</strong> {result.success ? 'Success' : 'Failed'}</div>
                    <div><strong>Message:</strong> {result.message}</div>
                    {result.url && (
                      <div>
                        <strong>Test URL:</strong>{' '}
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 underline"
                        >
                          {result.url}
                        </a>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-white font-medium mb-2">What this test does:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Tests connection to Vercel Blob</li>
                <li>• Uploads a small test file</li>
                <li>• Verifies the file is accessible via public URL</li>
                <li>• Confirms your token is working correctly</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <h3 className="text-blue-200 font-medium mb-2">Next Steps:</h3>
              <ul className="text-blue-100 text-sm space-y-1">
                <li>• If test passes: Image uploads in admin panel will work</li>
                <li>• If test fails: Check your Alsafa_READ_WRITE_TOKEN</li>
                <li>• Go to admin dashboard to test actual image uploads</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
