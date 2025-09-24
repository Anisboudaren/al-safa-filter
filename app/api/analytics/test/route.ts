import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if environment variables are set
    const gaProjectId = process.env.GA_PROJECT_ID
    const gaPrivateKeyId = process.env.GA_PRIVATE_KEY_ID
    const gaPrivateKey = process.env.GA_PRIVATE_KEY
    const gaClientEmail = process.env.GA_CLIENT_EMAIL
    const gaClientId = process.env.GA_CLIENT_ID
    const measurementId = process.env.MEASUREMENT_ID
    
    const checks = {
      hasGaProjectId: !!gaProjectId,
      hasGaPrivateKeyId: !!gaPrivateKeyId,
      hasGaPrivateKey: !!gaPrivateKey,
      hasGaClientEmail: !!gaClientEmail,
      hasGaClientId: !!gaClientId,
      hasMeasurementId: !!measurementId,
      measurementIdValue: measurementId || 'Not set',
      clientEmail: gaClientEmail || 'Not set',
      projectId: gaProjectId || 'Not set'
    }
    
    // Check if all required variables are present
    const requiredVars = [gaProjectId, gaPrivateKey, gaClientEmail, measurementId]
    const allRequiredPresent = requiredVars.every(Boolean)
    
    return NextResponse.json({
      status: 'Environment variables check',
      checks,
      allRequiredPresent,
      missingVars: {
        GA_PROJECT_ID: !gaProjectId,
        GA_PRIVATE_KEY: !gaPrivateKey,
        GA_CLIENT_EMAIL: !gaClientEmail,
        MEASUREMENT_ID: !measurementId
      },
      instructions: {
        step1: 'Create a .env.local file in your project root',
        step2: 'Add the individual Google Analytics environment variables',
        step3: 'Restart your development server',
        example: `GA_PROJECT_ID=your-project-id
GA_PRIVATE_KEY_ID=your-private-key-id
GA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
GA_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GA_CLIENT_ID=your-client-id
MEASUREMENT_ID=G-XXXXXXXXXX`
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check environment variables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
