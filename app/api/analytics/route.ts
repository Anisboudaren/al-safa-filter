import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    
    // Get environment variables
    const gaSecret = process.env.GA_SECRET
    const measurementId = process.env.MEASUREMENT_ID
    
    if (!gaSecret || !measurementId) {
      return NextResponse.json(
        { error: 'Google Analytics credentials not configured' },
        { status: 500 }
      )
    }

    // Parse the service account key
    let serviceAccountKey
    try {
      serviceAccountKey = JSON.parse(gaSecret)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid GA_SECRET format. Must be valid JSON.' },
        { status: 500 }
      )
    }

    // Create JWT client
    const auth = new google.auth.JWT(
      serviceAccountKey.client_email,
      undefined,
      serviceAccountKey.private_key,
      ['https://www.googleapis.com/auth/analytics.readonly']
    )

    // Create Analytics Reporting API client
    const analyticsreporting = google.analyticsreporting({ version: 'v4', auth })

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    const dateRange = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }

    // Fetch analytics data
    const [overviewData, pageViewsData, trafficData] = await Promise.all([
      // Overview metrics
      analyticsreporting.reports.batchGet({
        requestBody: {
          reportRequests: [{
            viewId: measurementId.replace('G-', ''),
            dateRanges: [dateRange],
            metrics: [
              { expression: 'ga:sessions' },
              { expression: 'ga:users' },
              { expression: 'ga:pageviews' },
              { expression: 'ga:bounceRate' },
              { expression: 'ga:avgSessionDuration' }
            ]
          }]
        }
      }),
      
      // Page views over time
      analyticsreporting.reports.batchGet({
        requestBody: {
          reportRequests: [{
            viewId: measurementId.replace('G-', ''),
            dateRanges: [dateRange],
            metrics: [{ expression: 'ga:pageviews' }],
            dimensions: [{ name: 'ga:date' }],
            orderBys: [{ fieldName: 'ga:date' }]
          }]
        }
      }),
      
      // Traffic sources
      analyticsreporting.reports.batchGet({
        requestBody: {
          reportRequests: [{
            viewId: measurementId.replace('G-', ''),
            dateRanges: [dateRange],
            metrics: [{ expression: 'ga:sessions' }],
            dimensions: [{ name: 'ga:source' }],
            orderBys: [{ fieldName: 'ga:sessions', sortOrder: 'DESCENDING' }],
            pageSize: 10
          }]
        }
      })
    ])

    // Process overview data
    const overviewReport = overviewData.data.reports?.[0]
    const overviewMetrics = overviewReport?.data?.totals?.[0]?.values || []
    
    const overview = {
      sessions: parseInt(overviewMetrics[0] || '0'),
      users: parseInt(overviewMetrics[1] || '0'),
      pageviews: parseInt(overviewMetrics[2] || '0'),
      bounceRate: parseFloat(overviewMetrics[3] || '0'),
      avgSessionDuration: parseFloat(overviewMetrics[4] || '0')
    }

    // Process page views data
    const pageViewsReport = pageViewsData.data.reports?.[0]
    const pageViewsRows = pageViewsReport?.data?.rows || []
    
    const pageViews = pageViewsRows.map(row => ({
      date: row.dimensions?.[0] || '',
      pageviews: parseInt(row.metrics?.[0]?.values?.[0] || '0')
    }))

    // Process traffic data
    const trafficReport = trafficData.data.reports?.[0]
    const trafficRows = trafficReport?.data?.rows || []
    
    const trafficSources = trafficRows.map(row => ({
      source: row.dimensions?.[0] || 'Direct',
      sessions: parseInt(row.metrics?.[0]?.values?.[0] || '0')
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
