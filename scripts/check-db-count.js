const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://qbpgclcndalyzflariuv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGdjbGNuZGFseXpmbGFyaXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE3NDAsImV4cCI6MjA3MDA0Nzc0MH0.eZlhQh-FO4ndlTQu8LZpwyvs6DAr4EAWn71DX9278Mw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseCount() {
  try {
    console.log('Checking database product counts...\n');
    
    // Get total count
    const { count: totalCount, error: totalError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) {
      console.error('Error getting total count:', totalError);
      return;
    }
    
    console.log(`Total products in database: ${totalCount}`);
    
    // Get count by filtration system
    const { data: systemCounts, error: systemError } = await supabase
      .from('products')
      .select('filtration_system')
      .not('filtration_system', 'is', null);
    
    if (systemError) {
      console.error('Error getting system counts:', systemError);
      return;
    }
    
    const counts = systemCounts.reduce((acc, product) => {
      acc[product.filtration_system] = (acc[product.filtration_system] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nProducts by filtration system:');
    Object.entries(counts).forEach(([system, count]) => {
      console.log(`  ${system}: ${count} products`);
    });
    
    // Show sample products from each system
    console.log('\nSample products:');
    for (const system of ['huile', 'gasoil', 'air']) {
      const { data: sample, error: sampleError } = await supabase
        .from('products')
        .select('ALSAFA, name, filtration_system')
        .eq('filtration_system', system)
        .limit(3);
      
      if (!sampleError && sample && sample.length > 0) {
        console.log(`\n${system.toUpperCase()} samples:`);
        sample.forEach(product => {
          console.log(`  - ${product.ALSAFA}: ${product.name}`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error checking database:', error.message);
  }
}

checkDatabaseCount();
