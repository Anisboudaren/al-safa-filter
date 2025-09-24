# Google Analytics Dashboard Setup Guide

This guide will help you set up the Google Analytics dashboard in your admin panel.

## Prerequisites

1. A Google Analytics 4 (GA4) property
2. A Google Cloud Project with Analytics Reporting API enabled
3. A service account with Analytics Reporting API access

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Analytics Reporting API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Analytics Reporting API"
   - Click "Enable"

## Step 2: Create a Service Account

1. In Google Cloud Console, go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Fill in the details:
   - **Name**: `analytics-service-account`
   - **Description**: `Service account for analytics dashboard`
4. Click "Create and Continue"
5. Skip the "Grant access" step for now
6. Click "Done"

## Step 3: Generate Service Account Key

1. Find your newly created service account in the list
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Select "JSON" format
6. Click "Create"
7. The JSON key file will be downloaded automatically

## Step 4: Add Service Account to Google Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to "Admin" (gear icon in bottom left)
4. In the "Property" column, click "Property access management"
5. Click the "+" button to add users
6. Add your service account email (from the JSON file: `client_email`)
7. Give it "Viewer" permissions
8. Click "Add"

## Step 5: Get Your Measurement ID

1. In Google Analytics, go to "Admin"
2. In the "Property" column, click "Property Settings"
3. Copy the "Measurement ID" (starts with "G-")

## Step 6: Configure Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following variables:

```env
# Google Analytics Configuration
GA_SECRET={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
MEASUREMENT_ID=G-1QE9KCQR5N
```

**Important**: 
- Replace the entire `GA_SECRET` value with the contents of your downloaded JSON file
- Make sure to keep the JSON as a single line string
- Replace `G-1QE9KCQR5N` with your actual Measurement ID

## Step 7: Test the Setup

1. Start your development server: `pnpm dev`
2. Go to your admin dashboard: `http://localhost:3000/admin/dashboard`
3. Click on the "Analytics" tab
4. You should see your analytics data displayed

## Troubleshooting

### Error: "Google Analytics credentials not configured"
- Make sure your `.env.local` file exists and contains the correct variables
- Restart your development server after adding environment variables

### Error: "Invalid GA_SECRET format"
- Ensure the `GA_SECRET` is a valid JSON string on a single line
- Make sure all quotes are properly escaped

### Error: "Failed to fetch analytics data"
- Verify your service account has access to the Google Analytics property
- Check that the Analytics Reporting API is enabled in your Google Cloud project
- Ensure your Measurement ID is correct

### No data showing
- Make sure your website has been visited and has generated some analytics data
- Check that the date range you're viewing has data
- Verify that your Google Analytics tracking code is properly installed on your website

## Features

The analytics dashboard includes:

- **Overview Metrics**: Sessions, Users, Page Views, Average Session Duration
- **Page Views Over Time**: Line chart showing daily page views
- **Traffic Sources**: Pie chart and table showing where your traffic comes from
- **Date Range Selection**: View data for 7, 30, or 90 days
- **Real-time Refresh**: Manual refresh button to get latest data

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your service account key secure
- Regularly rotate your service account keys
- Use the principle of least privilege for service account permissions

## Support

If you encounter any issues, check:
1. Google Cloud Console for API quotas and errors
2. Google Analytics for data availability
3. Your application logs for detailed error messages
