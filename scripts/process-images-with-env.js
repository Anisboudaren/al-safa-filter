// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { put } = require('@vercel/blob');

// Set the Vercel Blob token
process.env.BLOB_READ_WRITE_TOKEN = process.env.Alsafa_READ_WRITE_TOKEN;

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://qbpgclcndalyzflariuv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGdjbGNuZGFseXpmbGFyaXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE3NDAsImV4cCI6MjA3MDA0Nzc0MH0.eZlhQh-FO4ndlTQu8LZpwyvs6DAr4EAWn71DX9278Mw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Get command line arguments
const args = process.argv.slice(2);
const folder = args[0] || 'OBS'; // Default to OBS folder
const startIndex = parseInt(args[1]) || 0;
const batchSize = parseInt(args[2]) || 5;

console.log(`Processing ${folder} folder, starting from index ${startIndex}, batch size ${batchSize}`);
console.log(`Token available: ${process.env.BLOB_READ_WRITE_TOKEN ? 'Yes' : 'No'}`);

// Image processing function
async function processImage(inputPath, outputName) {
  try {
    const imageBuffer = fs.readFileSync(inputPath);
    
    // Try AVIF first
    try {
      const avifBuffer = await sharp(imageBuffer)
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .avif({ quality: 80 })
        .toBuffer();

      const avifFileName = `products/${outputName}.avif`;
      
      const blob = await put(avifFileName, avifBuffer, {
        access: 'public',
        contentType: 'image/avif'
      });

      return blob.url;
    } catch (avifErr) {
      // Fallback to WebP
      const webpBuffer = await sharp(imageBuffer)
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const webpFileName = `products/${outputName}.webp`;
      
      const blob = await put(webpFileName, webpBuffer, {
        access: 'public',
        contentType: 'image/webp'
      });

      return blob.url;
    }
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
    return null;
  }
}

// Function to get ALSAFA code from filename
function getAlsafaFromFilename(filename, folder) {
  const nameWithoutExt = path.parse(filename).name;
  
  // Remove common suffixes and clean up
  let cleanName = nameWithoutExt
    .replace(/\s+\d+$/, '') // Remove trailing numbers like " 1"
    .replace(/\s+TH\s*[A-Z]*$/, '') // Remove TH variants
    .replace(/\s+SP\s*[A-Z]*$/, '') // Remove SP variants
    .replace(/\s+JX\s*[A-Z]*$/, '') // Remove JX variants
    .replace(/\s+[A-Z]\s*$/, '') // Remove single letter variants
    .replace(/\s+/g, ''); // Remove all spaces
  
  // Add prefix based on folder
  if (folder === 'FAP') {
    if (cleanName.startsWith('FA')) {
      return `FA-${cleanName.substring(2)}`;
    } else if (cleanName.startsWith('FAP')) {
      return `FAP-${cleanName.substring(3)}`;
    } else if (cleanName.startsWith('FPL')) {
      return cleanName; // FPL codes don't have dashes
    }
  } else if (folder === 'OBS') {
    return `OBS-${cleanName.substring(3)}`;
  } else if (folder === 'GBS') {
    return `GBS-${cleanName.substring(3)}`;
  }
  
  return cleanName;
}

// Main processing function
async function processBatch() {
  try {
    const baseDir = path.join(__dirname, '../public/images');
    const folderPath = path.join(baseDir, folder);
    
    if (!fs.existsSync(folderPath)) {
      console.log(`Folder ${folder} not found!`);
      return;
    }
    
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );
    
    console.log(`Found ${imageFiles.length} images in ${folder}`);
    
    const batchFiles = imageFiles.slice(startIndex, startIndex + batchSize);
    console.log(`Processing batch: ${batchFiles.length} files`);
    
    let processed = 0;
    let uploaded = 0;
    let updated = 0;
    
    for (const file of batchFiles) {
      processed++;
      const inputPath = path.join(folderPath, file);
      const alsafaCode = getAlsafaFromFilename(file, folder);
      
      console.log(`\n[${processed}/${batchFiles.length}] Processing ${file} -> ALSAFA: ${alsafaCode}`);
      
      // Process and upload image
      const imageUrl = await processImage(inputPath, `${alsafaCode}_${Date.now()}`);
      
      if (imageUrl) {
        uploaded++;
        console.log(`✅ Uploaded: ${imageUrl}`);
        
        // Update database
        const { error } = await supabase
          .from('products')
          .update({ image_url: imageUrl })
          .eq('ALSAFA', alsafaCode);
        
        if (error) {
          console.log(`⚠️  Database update failed for ${alsafaCode}:`, error.message);
        } else {
          updated++;
          console.log(`✅ Database updated for ${alsafaCode}`);
        }
      } else {
        console.log(`❌ Failed to process ${file}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n=== BATCH COMPLETE ===`);
    console.log(`Processed: ${processed}`);
    console.log(`Uploaded: ${uploaded}`);
    console.log(`Database updated: ${updated}`);
    
    if (startIndex + batchSize < imageFiles.length) {
      console.log(`\nNext batch: node scripts/process-images-with-env.js ${folder} ${startIndex + batchSize} ${batchSize}`);
    } else {
      console.log(`\n✅ All images in ${folder} folder processed!`);
    }
    
  } catch (error) {
    console.error('Error processing batch:', error.message);
  }
}

// Run the processing
processBatch();
