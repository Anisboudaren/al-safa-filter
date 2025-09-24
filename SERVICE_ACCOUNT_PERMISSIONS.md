# Google Analytics Service Account Permissions Setup

## Current Status
✅ Property ID found: `506311171`  
❌ Authentication failing: 401 error

## Step 1: Verify Service Account Permissions in Google Analytics

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Select your property**
3. **Go to Admin** (gear icon in bottom left)
4. **In the "Property" column, click "Property access management"**
5. **Check if your service account is listed**:
   - Email: `alsafa@saas-authentification-434521.iam.gserviceaccount.com`
   - Permission: Should be "Viewer" or "Editor"

### If the service account is NOT listed:
1. **Click the "+" button** to add users
2. **Add the email**: `alsafa@saas-authentification-434521.iam.gserviceaccount.com`
3. **Select "Viewer" permissions**
4. **Click "Add"**

## Step 2: Verify Google Cloud Project Permissions

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project**: `saas-authentification-434521`
3. **Go to "IAM & Admin" > "IAM"**
4. **Find your service account**: `alsafa@saas-authentification-434521.iam.gserviceaccount.com`
5. **Check the roles** - it should have:
   - `Service Account User` (or similar)
   - `Analytics Viewer` (if available)

## Step 3: Verify APIs are Enabled

1. **Go to "APIs & Services" > "Library"**
2. **Search for and enable these APIs**:
   - ✅ **Google Analytics Data API** (GA4)
   - ✅ **Google Analytics Reporting API** (Universal Analytics)

## Step 4: Test the Authentication

After making the above changes:

1. **Restart your development server**
2. **Go to**: `http://localhost:3000/api/analytics/debug`
3. **Check the response** - it should show success instead of 401 error

## Step 5: Alternative - Create a New Service Account

If the above doesn't work, try creating a new service account:

1. **Go to Google Cloud Console**
2. **Go to "IAM & Admin" > "Service Accounts"**
3. **Click "Create Service Account"**
4. **Name**: `analytics-reader`
5. **Description**: `Read-only access to Google Analytics`
6. **Click "Create and Continue"**
7. **Skip the "Grant access" step**
8. **Click "Done"**
9. **Click on the new service account**
10. **Go to "Keys" tab**
11. **Click "Add Key" > "Create new key"**
12. **Select "JSON" format**
13. **Download the key file**
14. **Update your `.env.local` with the new credentials**
15. **Add the new service account to Google Analytics** (Step 1 above)

## Common Issues

### Issue 1: Service Account Not in Google Analytics
**Solution**: Add the service account email to Google Analytics with Viewer permissions

### Issue 2: Wrong Project
**Solution**: Make sure the service account is in the same Google Cloud project as your Google Analytics property

### Issue 3: API Not Enabled
**Solution**: Enable the Google Analytics Data API in Google Cloud Console

### Issue 4: Service Account Key Expired
**Solution**: Generate a new service account key

## Test Commands

You can also test the authentication directly:

```bash
# Test with the debug endpoint
curl http://localhost:3000/api/analytics/debug

# Test with the simple endpoint
curl http://localhost:3000/api/analytics/simple
```

## Expected Success Response

When working correctly, you should see:
```json
{
  "success": true,
  "message": "Google Analytics API is working correctly",
  "debug": {
    "apiCall": {
      "success": true,
      "hasData": true,
      "rowsCount": 1
    }
  }
}
```
