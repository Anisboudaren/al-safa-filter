# How to Find Your Google Analytics Property ID

## The Issue
The measurement ID (G-1QE9KCQR5N) and the property ID are different things. We need the actual property ID for the Google Analytics Data API.

## Method 1: From Google Analytics Admin

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to "Admin" (gear icon in bottom left)
4. In the "Property" column, click "Property Settings"
5. Look for "Property ID" - it's a number (like 123456789)
6. Copy this number

## Method 2: From Google Analytics Data API

1. Go to [Google Analytics Data API Explorer](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport)
2. Sign in with your Google account
3. Select your project
4. The property ID will be shown in the dropdown

## Method 3: From Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Look for your service account
5. Check the "Service Account Details" - it might show the property ID

## Method 4: Test Different Property IDs

If you're not sure, try these common formats:

```env
# Try these in your .env.local file:
GA_PROPERTY_ID=123456789
# or
GA_PROPERTY_ID=1QE9KCQR5N
# or
GA_PROPERTY_ID=G-1QE9KCQR5N
```

## Update Your .env.local

Add the property ID to your `.env.local` file:

```env
GA_PROPERTY_ID=your-actual-property-id-here
```

## Test the Setup

After adding the property ID:

1. Restart your development server
2. Go to: `http://localhost:3000/api/analytics/debug`
3. Check if the authentication error is resolved

## Common Property ID Formats

- **Numeric**: `123456789` (most common)
- **Alphanumeric**: `1QE9KCQR5N` (sometimes)
- **With G- prefix**: `G-1QE9KCQR5N` (measurement ID format)

Try the numeric format first, as that's the most common for GA4 properties.
