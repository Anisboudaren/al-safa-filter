import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET() {
  try {
    // Get environment variables
    const gaProjectId = process.env.GA_PROJECT_ID
    const gaPrivateKeyId = process.env.GA_PRIVATE_KEY_ID
    const gaPrivateKey = process.env.GA_PRIVATE_KEY
    const gaClientEmail = process.env.GA_CLIENT_EMAIL
    const gaClientId = process.env.GA_CLIENT_ID
    const measurementId = process.env.MEASUREMENT_ID
    const gaPropertyId = process.env.GA_PROPERTY_ID
    
    const debug = {
      envVars: {
        hasProjectId: !!gaProjectId,
        hasPrivateKey: !!gaPrivateKey,
        hasClientEmail: !!gaClientEmail,
        hasMeasurementId: !!measurementId,
        hasPropertyId: !!gaPropertyId,
        projectId: gaProjectId,
        clientEmail: gaClientEmail,
        measurementId: measurementId,
        propertyId: gaPropertyId
      }
    }

    if (!gaProjectId || !gaPrivateKey || !gaClientEmail || !measurementId) {
      return NextResponse.json({
        error: 'Missing required environment variables',
        debug
      }, { status: 500 })
    }

    // Construct the service account key object
    const serviceAccountKey = {
      type: "service_account",
      project_id: gaProjectId,
      private_key_id: gaPrivateKeyId,
      private_key: gaPrivateKey.replace(/\\n/g, '\n'),
      client_email: gaClientEmail,
      client_id: gaClientId,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(gaClientEmail)}`
    }

    debug.serviceAccountKey = {
      type: serviceAccountKey.type,
      project_id: serviceAccountKey.project_id,
      client_email: serviceAccountKey.client_email,
      hasPrivateKey: !!serviceAccountKey.private_key,
      privateKeyLength: serviceAccountKey.private_key?.length
    }

    // Create JWT client with proper authentication
    const auth = new google.auth.JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    })

    // Ensure we're authenticated
    await auth.authorize()

    debug.auth = {
      created: true,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
      authorized: true
    }

    // Create Analytics Data API client (GA4)
    const analyticsData = google.analyticsdata({ version: 'v1beta', auth })

    debug.analyticsClient = {
      created: true,
      version: 'v1beta (GA4 Data API)'
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 7)

    const dateRange = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }

    debug.dateRange = dateRange

    // Use the property ID from environment variable, or fallback to measurement ID
    const propertyId = gaPropertyId || measurementId.replace('G-', '')
    debug.finalPropertyId = propertyId

    // Test the API call with GA4 Data API
    try {
      const response = await analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [dateRange],
          metrics: [
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'screenPageViews' }
          ]
        }
      })

      debug.apiCall = {
        success: true,
        hasData: !!response.data.rows,
        rowsCount: response.data.rows?.length || 0
      }

      if (response.data.rows && response.data.rows[0]) {
        const row = response.data.rows[0]
        debug.reportData = {
          hasData: !!row,
          hasMetricValues: !!row.metricValues,
          metricValuesCount: row.metricValues?.length || 0,
          rawData: response.data
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Google Analytics API is working correctly',
        debug
      })

    } catch (apiError: any) {
      debug.apiError = {
        message: apiError.message,
        code: apiError.code,
        status: apiError.status,
        details: apiError.details || apiError.errors
      }

      return NextResponse.json({
        error: 'Google Analytics API call failed',
        debug
      }, { status: 500 })
    }

  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to initialize Google Analytics',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
