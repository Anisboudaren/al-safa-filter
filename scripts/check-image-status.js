const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://qbpgclcndalyzflariuv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGdjbGNuZGFseXpmbGFyaXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE3NDAsImV4cCI6MjA3MDA0Nzc0MH0.eZlhQh-FO4ndlTQu8LZpwyvs6DAr4EAWn71DX9278Mw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImageStatus() {
  try {
    console.log('Checking image status for all products...\n');
    
    // Get all products
    const { data: products, error } = await supabase
      .from('products')
      .select('id, ALSAFA, name, filtration_system, image_url')
      .order('filtration_system, ALSAFA');
    
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    
    console.log(`Total products: ${products.length}\n`);
    
    // Group by filtration system
    const bySystem = products.reduce((acc, product) => {
      if (!acc[product.filtration_system]) {
        acc[product.filtration_system] = { total: 0, withImages: 0, withoutImages: 0 };
      }
      acc[product.filtration_system].total++;
      if (product.image_url) {
        acc[product.filtration_system].withImages++;
      } else {
        acc[product.filtration_system].withoutImages++;
      }
      return acc;
    }, {});
    
    // Display summary
    Object.entries(bySystem).forEach(([system, stats]) => {
      console.log(`${system.toUpperCase()}:`);
      console.log(`  Total: ${stats.total}`);
      console.log(`  With images: ${stats.withImages} (${Math.round(stats.withImages/stats.total*100)}%)`);
      console.log(`  Without images: ${stats.withoutImages} (${Math.round(stats.withoutImages/stats.total*100)}%)`);
      console.log('');
    });
    
    // Show products without images
    const withoutImages = products.filter(p => !p.image_url);
    if (withoutImages.length > 0) {
      console.log('Products without images:');
      withoutImages.slice(0, 10).forEach(product => {
        console.log(`  ${product.ALSAFA} (${product.filtration_system})`);
      });
      if (withoutImages.length > 10) {
        console.log(`  ... and ${withoutImages.length - 10} more`);
      }
    }
    
    // Show sample products with images
    const withImages = products.filter(p => p.image_url);
    if (withImages.length > 0) {
      console.log('\nSample products with images:');
      withImages.slice(0, 5).forEach(product => {
        console.log(`  ${product.ALSAFA} (${product.filtration_system})`);
        console.log(`    URL: ${product.image_url}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking image status:', error.message);
  }
}

checkImageStatus();
