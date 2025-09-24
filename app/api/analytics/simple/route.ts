import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    
    // Get environment variables
    const gaProjectId = process.env.GA_PROJECT_ID
    const gaPrivateKeyId = process.env.GA_PRIVATE_KEY_ID
    const gaPrivateKey = process.env.GA_PRIVATE_KEY
    const gaClientEmail = process.env.GA_CLIENT_EMAIL
    const gaClientId = process.env.GA_CLIENT_ID
    const measurementId = process.env.MEASUREMENT_ID
    const gaPropertyId = process.env.GA_PROPERTY_ID
    
    if (!gaProjectId || !gaPrivateKey || !gaClientEmail || !measurementId) {
      return NextResponse.json({
        error: 'Missing required environment variables',
        missing: {
          GA_PROJECT_ID: !gaProjectId,
          GA_PRIVATE_KEY: !gaPrivateKey,
          GA_CLIENT_EMAIL: !gaClientEmail,
          MEASUREMENT_ID: !measurementId
        }
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

    // Create JWT client with proper authentication
    const auth = new google.auth.JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    })

    // Ensure we're authenticated
    await auth.authorize()

    // Create Analytics Data API client (for GA4)
    const analyticsData = google.analyticsdata({ version: 'v1beta', auth })

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    const dateRange = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }

    const propertyId = gaPropertyId || measurementId.replace('G-', '')

    // Try to fetch basic analytics data
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

      // Process the response
      const rows = response.data.rows || []
      const metrics = rows[0]?.metricValues || []

      const overview = {
        sessions: parseInt(metrics[0]?.value || '0'),
        users: parseInt(metrics[1]?.value || '0'),
        pageviews: parseInt(metrics[2]?.value || '0'),
        bounceRate: 0, // Not available in basic call
        avgSessionDuration: 0 // Not available in basic call
      }

      return NextResponse.json({
        success: true,
        overview,
        pageViews: [], // Simplified for now
        trafficSources: [], // Simplified for now
        dateRange,
        debug: {
          propertyId,
          hasData: rows.length > 0,
          rawResponse: response.data
        }
      })

    } catch (apiError: any) {
      return NextResponse.json({
        error: 'Google Analytics API call failed',
        details: {
          message: apiError.message,
          code: apiError.code,
          status: apiError.status,
          details: apiError.details || apiError.errors
        },
        debug: {
          propertyId,
          dateRange,
          measurementId
        }
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
