// Simple test script to debug Google Analytics API
const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

async function testAnalytics() {
  try {
    console.log('🔍 Testing Google Analytics API...\n');
    
    // Check environment variables
    const gaProjectId = process.env.GA_PROJECT_ID;
    const gaPrivateKey = process.env.GA_PRIVATE_KEY;
    const gaClientEmail = process.env.GA_CLIENT_EMAIL;
    const measurementId = process.env.MEASUREMENT_ID;
    
    console.log('📋 Environment Variables:');
    console.log(`GA_PROJECT_ID: ${gaProjectId ? '✅ Set' : '❌ Missing'}`);
    console.log(`GA_PRIVATE_KEY: ${gaPrivateKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`GA_CLIENT_EMAIL: ${gaClientEmail ? '✅ Set' : '❌ Missing'}`);
    console.log(`MEASUREMENT_ID: ${measurementId ? '✅ Set' : '❌ Missing'}\n`);
    
    if (!gaProjectId || !gaPrivateKey || !gaClientEmail || !measurementId) {
      console.log('❌ Missing required environment variables!');
      return;
    }
    
    // Construct service account key
    const serviceAccountKey = {
      type: "service_account",
      project_id: gaProjectId,
      private_key_id: process.env.GA_PRIVATE_KEY_ID,
      private_key: gaPrivateKey.replace(/\\n/g, '\n'),
      client_email: gaClientEmail,
      client_id: process.env.GA_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(gaClientEmail)}`
    };
    
    console.log('🔑 Service Account Key:');
    console.log(`Type: ${serviceAccountKey.type}`);
    console.log(`Project ID: ${serviceAccountKey.project_id}`);
    console.log(`Client Email: ${serviceAccountKey.client_email}`);
    console.log(`Private Key Length: ${serviceAccountKey.private_key.length}\n`);
    
    // Create auth client
    const auth = new google.auth.JWT(
      serviceAccountKey.client_email,
      undefined,
      serviceAccountKey.private_key,
      ['https://www.googleapis.com/auth/analytics.readonly']
    );
    
    console.log('🔐 Auth client created successfully\n');
    
    // Test with Analytics Data API (GA4)
    const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
    
    console.log('📊 Testing Analytics Data API...');
    
    const propertyId = measurementId.replace('G-', '');
    console.log(`Property ID: ${propertyId}`);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    const dateRange = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
    
    console.log(`Date Range: ${dateRange.startDate} to ${dateRange.endDate}\n`);
    
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
      });
      
      console.log('✅ Analytics Data API call successful!');
      console.log('📈 Response data:');
      console.log(JSON.stringify(response.data, null, 2));
      
    } catch (apiError) {
      console.log('❌ Analytics Data API call failed:');
      console.log(`Error: ${apiError.message}`);
      console.log(`Code: ${apiError.code}`);
      console.log(`Status: ${apiError.status}`);
      if (apiError.details) {
        console.log('Details:', JSON.stringify(apiError.details, null, 2));
      }
    }
    
  } catch (error) {
    console.log('❌ Test failed:');
    console.log(error.message);
    console.log(error.stack);
  }
}

testAnalytics();
