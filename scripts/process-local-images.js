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

// Image processing function
async function processImage(inputPath, outputName) {
  try {
    console.log(`Processing: ${inputPath}`);
    
    const imageBuffer = fs.readFileSync(inputPath);
    
    // Try AVIF first
    try {
      const avifBuffer = await sharp(imageBuffer)
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .avif({ quality: 80 })
        .toBuffer();

      const avifFileName = `products/${outputName}.avif`;
      console.log(`Uploading AVIF: ${avifFileName}`);
      
      const blob = await put(avifFileName, avifBuffer, {
        access: 'public',
        contentType: 'image/avif'
      });

      return blob.url;
    } catch (avifErr) {
      console.log(`AVIF failed for ${outputName}, trying WebP...`);
      
      // Fallback to WebP
      const webpBuffer = await sharp(imageBuffer)
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const webpFileName = `products/${outputName}.webp`;
      console.log(`Uploading WebP: ${webpFileName}`);
      
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
async function processAllImages() {
  try {
    console.log('Starting image processing and upload...\n');
    
    const baseDir = path.join(__dirname, '../public/images');
    const folders = ['FAP', 'OBS', 'GBS'];
    
    let totalProcessed = 0;
    let totalUploaded = 0;
    let totalUpdated = 0;
    
    for (const folder of folders) {
      const folderPath = path.join(baseDir, folder);
      
      if (!fs.existsSync(folderPath)) {
        console.log(`Folder ${folder} not found, skipping...`);
        continue;
      }
      
      console.log(`\nProcessing folder: ${folder}`);
      const files = fs.readdirSync(folderPath);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|webp)$/i.test(file)
      );
      
      console.log(`Found ${imageFiles.length} images in ${folder}`);
      
      for (const file of imageFiles) {
        totalProcessed++;
        const inputPath = path.join(folderPath, file);
        const alsafaCode = getAlsafaFromFilename(file, folder);
        
        console.log(`\nProcessing ${file} -> ALSAFA: ${alsafaCode}`);
        
        // Process and upload image
        const imageUrl = await processImage(inputPath, `${alsafaCode}_${Date.now()}`);
        
        if (imageUrl) {
          totalUploaded++;
          console.log(`✅ Uploaded: ${imageUrl}`);
          
          // Update database
          const { error } = await supabase
            .from('products')
            .update({ image_url: imageUrl })
            .eq('ALSAFA', alsafaCode);
          
          if (error) {
            console.log(`⚠️  Database update failed for ${alsafaCode}:`, error.message);
          } else {
            totalUpdated++;
            console.log(`✅ Database updated for ${alsafaCode}`);
          }
        } else {
          console.log(`❌ Failed to process ${file}`);
        }
      }
    }
    
    console.log(`\n=== PROCESSING COMPLETE ===`);
    console.log(`Total images processed: ${totalProcessed}`);
    console.log(`Total images uploaded: ${totalUploaded}`);
    console.log(`Total database records updated: ${totalUpdated}`);
    
  } catch (error) {
    console.error('Error processing images:', error.message);
  }
}

// Run the processing
processAllImages();
