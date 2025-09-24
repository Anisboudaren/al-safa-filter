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
      return NextResponse.json(
        { error: 'Google Analytics credentials not configured. Missing required environment variables.' },
        { status: 500 }
      )
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

    // Create Analytics Data API client (GA4)
    const analyticsData = google.analyticsdata({ version: 'v1beta', auth })

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    const dateRange = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }

    // Fetch analytics data using GA4 Data API
    const [overviewData, pageViewsData, trafficData] = await Promise.all([
      // Overview metrics
      analyticsData.properties.runReport({
        property: `properties/${gaPropertyId || measurementId.replace('G-', '')}`,
        requestBody: {
          dateRanges: [dateRange],
          metrics: [
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' }
          ]
        }
      }),
      
      // Page views over time
      analyticsData.properties.runReport({
        property: `properties/${gaPropertyId || measurementId.replace('G-', '')}`,
        requestBody: {
          dateRanges: [dateRange],
          metrics: [{ name: 'screenPageViews' }],
          dimensions: [{ name: 'date' }],
          orderBys: [{ dimension: { dimensionName: 'date' } }]
        }
      }),
      
      // Traffic sources
      analyticsData.properties.runReport({
        property: `properties/${gaPropertyId || measurementId.replace('G-', '')}`,
        requestBody: {
          dateRanges: [dateRange],
          metrics: [{ name: 'sessions' }],
          dimensions: [{ name: 'sessionSource' }],
          orderBys: [{ metric: { metricName: 'sessions' } }],
          limit: 10
        }
      })
    ])

    // Process overview data (GA4 Data API format)
    const overviewMetrics = overviewData.data.rows?.[0]?.metricValues || []
    
    const overview = {
      sessions: parseInt(overviewMetrics[0]?.value || '0'),
      users: parseInt(overviewMetrics[1]?.value || '0'),
      pageviews: parseInt(overviewMetrics[2]?.value || '0'),
      bounceRate: parseFloat(overviewMetrics[3]?.value || '0'),
      avgSessionDuration: parseFloat(overviewMetrics[4]?.value || '0')
    }

    // Process page views data
    const pageViewsRows = pageViewsData.data.rows || []
    
    const pageViews = pageViewsRows.map(row => ({
      date: row.dimensionValues?.[0]?.value || '',
      pageviews: parseInt(row.metricValues?.[0]?.value || '0')
    }))

    // Process traffic data
    const trafficRows = trafficData.data.rows || []
    
    const trafficSources = trafficRows.map(row => ({
      source: row.dimensionValues?.[0]?.value || 'Direct',
      sessions: parseInt(row.metricValues?.[0]?.value || '0')
    }))

    return NextResponse.json({
      overview,
      pageViews,
      trafficSources,
      dateRange
    })

  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
