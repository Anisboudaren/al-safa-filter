const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://qbpgclcndalyzflariuv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGdjbGNuZGFseXpmbGFyaXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE3NDAsImV4cCI6MjA3MDA0Nzc0MH0.eZlhQh-FO4ndlTQu8LZpwyvs6DAr4EAWn71DX9278Mw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
  try {
    console.log('Checking for duplicate products...\n');
    
    // Get all products
    const { data: products, error } = await supabase
      .from('products')
      .select('ALSAFA, filtration_system, created_at')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    
    console.log(`Total products in database: ${products.length}`);
    
    // Group by ALSAFA + filtration_system to find duplicates
    const grouped = products.reduce((acc, product) => {
      const key = `${product.ALSAFA}-${product.filtration_system}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(product);
      return acc;
    }, {});
    
    // Find duplicates
    const duplicates = Object.entries(grouped).filter(([key, items]) => items.length > 1);
    
    console.log(`\nFound ${duplicates.length} duplicate product groups:`);
    
    duplicates.slice(0, 10).forEach(([key, items]) => {
      console.log(`\n${key}: ${items.length} copies`);
      items.forEach((item, index) => {
        console.log(`  ${index + 1}. Created: ${item.created_at}`);
      });
    });
    
    if (duplicates.length > 10) {
      console.log(`\n... and ${duplicates.length - 10} more duplicate groups`);
    }
    
    // Count unique products
    const uniqueProducts = Object.keys(grouped).length;
    console.log(`\nUnique products: ${uniqueProducts}`);
    console.log(`Duplicate entries: ${products.length - uniqueProducts}`);
    
    // Show distribution by filtration system
    const systemCounts = products.reduce((acc, product) => {
      acc[product.filtration_system] = (acc[product.filtration_system] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nCurrent distribution:');
    Object.entries(systemCounts).forEach(([system, count]) => {
      console.log(`  ${system}: ${count} products`);
    });
    
  } catch (error) {
    console.error('Error checking duplicates:', error.message);
  }
}

checkDuplicates();
