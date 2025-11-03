"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  ArrowLeft
} from "lucide-react"

export default function SetupAnalytics() {
  const [user, setUser] = useState<any>(null)
  const [envCheck, setEnvCheck] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [gaProjectId, setGaProjectId] = useState("")
  const [gaPrivateKeyId, setGaPrivateKeyId] = useState("")
  const [gaPrivateKey, setGaPrivateKey] = useState("")
  const [gaClientEmail, setGaClientEmail] = useState("")
  const [gaClientId, setGaClientId] = useState("")
  const [measurementId, setMeasurementId] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkUser()
    checkEnvironment()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/home")
    } else {
      setUser(user)
    }
  }

  const checkEnvironment = async () => {
    try {
      const response = await fetch('/api/analytics/test')
      const data = await response.json()
      setEnvCheck(data)
    } catch (error) {
      console.error('Error checking environment:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const generateEnvFile = () => {
    const envContent = `# Google Analytics Configuration
GA_PROJECT_ID=${gaProjectId}
GA_PRIVATE_KEY_ID=${gaPrivateKeyId}
GA_PRIVATE_KEY="${gaPrivateKey}"
GA_CLIENT_EMAIL=${gaClientEmail}
GA_CLIENT_ID=${gaClientId}
MEASUREMENT_ID=${measurementId}

# Add your other environment variables below
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# BLOB_READ_WRITE_TOKEN=your_vercel_blob_token`
    
    return envContent
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                onClick={() => router.push('/admin/dashboard')}
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold text-white">Analytics Setup</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">{user.email}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Current Status */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                Current Environment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {envCheck ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      {envCheck.checks.hasGaProjectId ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className="text-white">GA_PROJECT_ID: {envCheck.checks.hasGaProjectId ? 'Set' : 'Not set'}</span>
                    </div>
                    <div className="flex items-center">
                      {envCheck.checks.hasGaClientEmail ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className="text-white">GA_CLIENT_EMAIL: {envCheck.checks.hasGaClientEmail ? 'Set' : 'Not set'}</span>
                    </div>
                    <div className="flex items-center">
                      {envCheck.checks.hasGaPrivateKey ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className="text-white">GA_PRIVATE_KEY: {envCheck.checks.hasGaPrivateKey ? 'Set' : 'Not set'}</span>
                    </div>
                    <div className="flex items-center">
                      {envCheck.checks.hasMeasurementId ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className="text-white">MEASUREMENT_ID: {envCheck.checks.hasMeasurementId ? 'Set' : 'Not set'}</span>
                    </div>
                  </div>
                  
                  {envCheck.checks.hasGaClientEmail && (
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-300 mb-2">Client Email:</p>
                      <code className="text-sm text-gray-400">{envCheck.checks.clientEmail}</code>
                    </div>
                  )}
                  
                  {envCheck.checks.hasMeasurementId && (
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-300 mb-2">Measurement ID:</p>
                      <code className="text-sm text-gray-400">{envCheck.checks.measurementIdValue}</code>
                    </div>
                  )}
                  
                  {envCheck.allRequiredPresent ? (
                    <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                      <p className="text-green-400 font-medium">✅ All required environment variables are set!</p>
                    </div>
                  ) : (
                    <div className="bg-yellow-900/20 border border-yellow-500 p-4 rounded-lg">
                      <p className="text-yellow-400 font-medium">⚠️ Missing required variables:</p>
                      <ul className="text-yellow-300 text-sm mt-2">
                        {Object.entries(envCheck.missingVars).map(([key, missing]) => 
                          missing && <li key={key}>• {key}</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <Button
                    onClick={checkEnvironment}
                    variant="outline"
                    className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    Refresh Status
                  </Button>
                </div>
              ) : (
                <div className="text-gray-400">Loading environment status...</div>
              )}
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Step 1: Get Your Google Analytics Credentials</h3>
                  <p className="text-gray-400 mb-4">
                    Follow the detailed guide in <code className="bg-gray-700 px-2 py-1 rounded text-orange-400">ANALYTICS_SETUP.md</code> to get your service account JSON and measurement ID.
                  </p>
                  <Button
                    onClick={() => window.open('/ANALYTICS_SETUP.md', '_blank')}
                    variant="outline"
                    className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Setup Guide
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Step 2: Configure Environment Variables</h3>
                  <p className="text-gray-400 mb-4">
                    Create a <code className="bg-gray-700 px-2 py-1 rounded text-orange-400">.env.local</code> file in your project root with the following content:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ga-project-id" className="text-white">Project ID (GA_PROJECT_ID)</Label>
                      <Input
                        id="ga-project-id"
                        placeholder="your-project-id"
                        value={gaProjectId}
                        onChange={(e) => setGaProjectId(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ga-private-key-id" className="text-white">Private Key ID (GA_PRIVATE_KEY_ID)</Label>
                      <Input
                        id="ga-private-key-id"
                        placeholder="your-private-key-id"
                        value={gaPrivateKeyId}
                        onChange={(e) => setGaPrivateKeyId(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ga-private-key" className="text-white">Private Key (GA_PRIVATE_KEY)</Label>
                      <Textarea
                        id="ga-private-key"
                        placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                        value={gaPrivateKey}
                        onChange={(e) => setGaPrivateKey(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 mt-2"
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ga-client-email" className="text-white">Client Email (GA_CLIENT_EMAIL)</Label>
                      <Input
                        id="ga-client-email"
                        placeholder="your-service-account@your-project.iam.gserviceaccount.com"
                        value={gaClientEmail}
                        onChange={(e) => setGaClientEmail(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ga-client-id" className="text-white">Client ID (GA_CLIENT_ID)</Label>
                      <Input
                        id="ga-client-id"
                        placeholder="your-client-id"
                        value={gaClientId}
                        onChange={(e) => setGaClientId(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="measurement-id" className="text-white">Measurement ID (MEASUREMENT_ID)</Label>
                      <Input
                        id="measurement-id"
                        placeholder="G-XXXXXXXXXX"
                        value={measurementId}
                        onChange={(e) => setMeasurementId(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Step 3: Generate .env.local File</h3>
                  <p className="text-gray-400 mb-4">
                    Copy the generated content below and save it as <code className="bg-gray-700 px-2 py-1 rounded text-orange-400">.env.local</code> in your project root:
                  </p>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">Generated .env.local content:</span>
                      <Button
                        onClick={() => copyToClipboard(generateEnvFile())}
                        size="sm"
                        variant="outline"
                        className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap overflow-x-auto">
                      {generateEnvFile()}
                    </pre>
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500 p-4 rounded-lg">
                  <h4 className="text-yellow-400 font-medium mb-2">Important Notes:</h4>
                  <ul className="text-yellow-300 text-sm space-y-1">
                    <li>• Copy each value from your Google Analytics service account JSON file</li>
                    <li>• Keep the private key exactly as it appears (with \n for line breaks)</li>
                    <li>• Never commit the .env.local file to version control</li>
                    <li>• Restart your development server after creating the .env.local file</li>
                    <li>• The measurement ID should start with "G-"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
