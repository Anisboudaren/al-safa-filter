# Image Processing Workflow

## Overview
This system automatically processes local product images, converts them to AVIF/WebP format, uploads them to Vercel Blob, and updates the database with the online URLs.

## How It Works

### 1. Local Image Organization
Images are organized in `/public/images/` by filter type:
- `FAP/` - Air filters (FA-, FAP-, FPL- codes)
- `OBS/` - Oil filters (OBS- codes)  
- `GBS/` - Diesel filters (GBS- codes)

### 2. Image Processing Pipeline
1. **Read local image** from organized folder
2. **Convert to AVIF** (best compression) or fallback to WebP
3. **Resize to 400x400px** for optimal performance
4. **Upload to Vercel Blob** with public access
5. **Update database** with the online URL
6. **Remove local dependency** - only use online URLs

### 3. Smart ALSAFA Mapping
The system automatically maps filenames to ALSAFA codes:
- `OBS132 1.jpg` → `OBS-132`
- `FA1501.jpg` → `FA-1501`
- `FAP5001.jpg` → `FAP-5001`
- `GBS600.png` → `GBS-600`

## Usage

### Check Current Status
```bash
node scripts/check-image-status.js
```
Shows how many products have images and which ones are missing.

### Process Images (Batch Mode)
```bash
# Process OBS folder, 10 images at a time
node scripts/process-images-batch.js OBS 0 10

# Process FAP folder, 5 images at a time  
node scripts/process-images-batch.js FAP 0 5

# Process GBS folder, 15 images at a time
node scripts/process-images-batch.js GBS 0 15
```

### Process All Images (Full Mode)
```bash
node scripts/process-local-images.js
```
⚠️ **Warning**: This processes all images at once and may take a long time.

## Batch Processing Workflow

1. **Start with small batches** (5-10 images) to test
2. **Check results** after each batch
3. **Increase batch size** once confirmed working
4. **Process each folder separately** to avoid overwhelming the system

### Example Workflow:
```bash
# 1. Check current status
node scripts/check-image-status.js

# 2. Process OBS folder in small batches
node scripts/process-images-batch.js OBS 0 5
node scripts/process-images-batch.js OBS 5 5
node scripts/process-images-batch.js OBS 10 5
# ... continue until all processed

# 3. Process FAP folder
node scripts/process-images-batch.js FAP 0 10
# ... continue

# 4. Process GBS folder  
node scripts/process-images-batch.js GBS 0 10
# ... continue

# 5. Final status check
node scripts/check-image-status.js
```

## Benefits

### Performance
- ✅ **AVIF Format** - Best compression, smallest file size
- ✅ **WebP Fallback** - Good compression if AVIF fails
- ✅ **Optimized Size** - 400x400px for fast loading
- ✅ **Global CDN** - Vercel Blob delivers worldwide

### Scalability
- ✅ **Add More Images** - Just add to local folders and process
- ✅ **Automatic Processing** - No manual image management
- ✅ **Database Integration** - Automatic URL updates
- ✅ **Batch Processing** - Handle large numbers of images

### Maintenance
- ✅ **Online Only** - No local image dependencies
- ✅ **Consistent URLs** - All images use Vercel Blob
- ✅ **Easy Updates** - Re-process images anytime
- ✅ **Error Handling** - Graceful fallbacks and logging

## File Naming Rules

### Supported Formats
- `.jpg`, `.jpeg`, `.png`, `.webp`

### Naming Conventions
- `OBS132.jpg` → `OBS-132`
- `OBS132 1.jpg` → `OBS-132` (removes trailing numbers)
- `FA1501TH.jpg` → `FA-1501` (removes TH suffix)
- `FAP5001SP.jpg` → `FAP-5001` (removes SP suffix)

### Special Cases
- `FPL` codes don't get dashes: `FPL001.jpg` → `FPL001`
- Multiple variants are handled: `OBS132A.jpg` → `OBS-132`

## Troubleshooting

### Common Issues
1. **Token Error** - Make sure `Alsafa_READ_WRITE_TOKEN` is set
2. **Upload Fails** - Check Vercel Blob quota and permissions
3. **Database Error** - Verify Supabase connection and table structure
4. **Image Not Found** - Check ALSAFA code mapping

### Debug Steps
1. Run status check to see current state
2. Process small batch to test
3. Check database for updated URLs
4. Verify images load in admin dashboard

## Next Steps

After processing all images:
1. **Remove local images** (optional) - they're now online
2. **Update admin dashboard** - will show all product images
3. **Add new images** - just add to folders and process
4. **Monitor performance** - check loading times and quality
