const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://qbpgclcndalyzflariuv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGdjbGNuZGFseXpmbGFyaXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE3NDAsImV4cCI6MjA3MDA0Nzc0MH0.eZlhQh-FO4ndlTQu8LZpwyvs6DAr4EAWn71DX9278Mw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDuplicates() {
  try {
    console.log('Cleaning up duplicate products...\n');
    
    // Get all products ordered by creation time
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, ALSAFA, filtration_system, created_at')
      .order('created_at', { ascending: true });
    
    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return;
    }
    
    console.log(`Total products before cleanup: ${products.length}`);
    
    // Group by ALSAFA + filtration_system
    const grouped = products.reduce((acc, product) => {
      const key = `${product.ALSAFA}-${product.filtration_system}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(product);
      return acc;
    }, {});
    
    // Find duplicates and collect IDs to delete
    const idsToDelete = [];
    let duplicateGroups = 0;
    
    Object.entries(grouped).forEach(([key, items]) => {
      if (items.length > 1) {
        duplicateGroups++;
        // Keep the first one (oldest), delete the rest
        const toDelete = items.slice(1);
        idsToDelete.push(...toDelete.map(item => item.id));
      }
    });
    
    console.log(`Found ${duplicateGroups} duplicate groups`);
    console.log(`Will delete ${idsToDelete.length} duplicate entries`);
    
    if (idsToDelete.length === 0) {
      console.log('No duplicates found to clean up!');
      return;
    }
    
    // Delete duplicates in batches
    const batchSize = 100;
    let deletedCount = 0;
    
    for (let i = 0; i < idsToDelete.length; i += batchSize) {
      const batch = idsToDelete.slice(i, i + batchSize);
      
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', batch);
      
      if (deleteError) {
        console.error(`Error deleting batch ${Math.floor(i/batchSize) + 1}:`, deleteError);
      } else {
        deletedCount += batch.length;
        console.log(`Deleted batch ${Math.floor(i/batchSize) + 1} (${batch.length} products)`);
      }
    }
    
    console.log(`\nCleanup complete!`);
    console.log(`Deleted ${deletedCount} duplicate products`);
    
    // Get final count
    const { count: finalCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`Final product count: ${finalCount}`);
    }
    
  } catch (error) {
    console.error('Error cleaning duplicates:', error.message);
  }
}

cleanDuplicates();
