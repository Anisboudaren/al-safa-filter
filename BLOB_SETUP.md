# Vercel Blob Setup Guide

## 1. Get Vercel Blob Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to Settings → Environment Variables
4. Add a new environment variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Your Vercel Blob token (get it from Vercel dashboard)

## 2. Environment Variables

Add these to your `.env.local` file:

```env
# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://qbpgclcndalyzflariuv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGdjbGNuZGFseXpmbGFyaXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE3NDAsImV4cCI6MjA3MDA0Nzc0MH0.eZlhQh-FO4ndlTQu8LZpwyvs6DAr4EAWn71DX9278Mw
```

## 3. Test the Setup

1. Install dependencies: `pnpm install`
2. Test Vercel Blob: Visit `/api/test-blob` in your browser
3. Test image upload: Try uploading an image in the admin panel

## 4. How It Works

- Images are automatically converted to AVIF (best compression)
- Falls back to WebP if AVIF fails
- Falls back to original format if WebP fails
- Images are resized to 400x400px for optimal performance
- Stored in Vercel Blob with public access
- URLs are automatically generated and stored in database

## 5. Benefits of Vercel Blob

- ✅ **No setup required** - Just add the token
- ✅ **Global CDN** - Fast image delivery worldwide
- ✅ **Automatic optimization** - Built-in performance features
- ✅ **Simple API** - Easy to use and maintain
- ✅ **Cost effective** - Pay only for what you use
