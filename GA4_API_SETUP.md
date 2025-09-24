# Google Analytics 4 (GA4) API Setup Guide

## The Issue
You're getting a 404 error because we need to use the **Google Analytics Data API** (GA4) instead of the old **Analytics Reporting API**.

## Required APIs to Enable

### 1. Google Analytics Data API (GA4)
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Select your project: `saas-authentification-434521`
- Go to "APIs & Services" > "Library"
- Search for "**Google Analytics Data API**"
- Click "Enable"

### 2. Google Analytics Reporting API (Optional - for Universal Analytics)
- Search for "**Google Analytics Reporting API**"
- Click "Enable" (if you want to support both GA4 and Universal Analytics)

## Service Account Permissions

Make sure your service account has access to your Google Analytics property:

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to "Admin" (gear icon)
4. In the "Property" column, click "Property access management"
5. Add your service account email: `alsafa@saas-authentification-434521.iam.gserviceaccount.com`
6. Give it "**Viewer**" permissions
7. Click "Add"

## Test the Setup

After enabling the APIs:

1. Go to: `http://localhost:3000/api/analytics/debug`
2. You should see a successful response instead of the 404 error

## Common Issues

### Issue 1: API Not Enabled
**Error**: 404 Not Found
**Solution**: Enable the Google Analytics Data API in Google Cloud Console

### Issue 2: Wrong Property ID
**Error**: Property not found
**Solution**: Make sure your measurement ID is correct (G-1QE9KCQR5N)

### Issue 3: No Data
**Error**: No data returned
**Solution**: 
- Make sure your website has been visited
- Check that the date range has data
- Verify your Google Analytics tracking code is working

### Issue 4: Permission Denied
**Error**: 403 Forbidden
**Solution**: Add your service account to Google Analytics with Viewer permissions

## Quick Test

Run this command to test your setup:
```bash
node test-analytics.js
```

This will show you exactly what's working and what's not.
