const XLSX = require('xlsx');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://qbpgclcndalyzflariuv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGdjbGNuZGFseXpmbGFyaXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE3NDAsImV4cCI6MjA3MDA0Nzc0MH0.eZlhQh-FO4ndlTQu8LZpwyvs6DAr4EAWn71DX9278Mw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping function to convert Excel data to database schema
function mapExcelRowToProduct(row, filtrationSystem) {
  return {
    name: row['Name'] || row['name'] || row['NAME'] || `Filter ${row['ALSAFA'] || 'Unknown'}`,
    description: row['Description'] || row['description'] || row['DESCRIPTION'] || null,
    image_url: row['Image URL'] || row['image_url'] || row['IMAGE_URL'] || null,
    ALSAFA: row['ALSAFA'] || null,
    Ext: row['Ext'] || row['D EXT'] || null,
    Int: row['Int'] || row['D INT'] || null,
    H: row['H'] || null,
    SAFI: row['SAFI'] || null,
    SARL_F: row['SARL F'] || row['SARL_F'] || null,
    FLEETG: row['FLEETG'] || row['FLEETGD'] || null,
    ASAS: row['ASAS'] || null,
    MECA_F: row['MECA F'] || row['MECA_F'] || row['MECA'] || null,
    REF_ORG: row['REF. ORG'] || row['REF_ORG'] || row['REF ORG'] || row['ORIGINE'] || null,
    divers_vehicules: row['        DIVERS VEHICULES '] || row['APPLICATIONS'] || row['APPLICATION'] || row['divers_vehicules'] || row['Divers Vehicules'] || null,
    filtration_system: filtrationSystem,
    Ptte: row['Ptte'] || null,
    MANN: row['MANN'] || null,
    UFI: row['UFI'] || null,
    HIFI: row['HIFI'] || null,
    WIX: row['WIX'] || null
  };
}

async function freshImport() {
  try {
    console.log('Starting fresh import...\n');
    
    // First, clear all existing products
    console.log('Clearing existing products...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Delete all records
    
    if (deleteError) {
      console.error('Error clearing products:', deleteError);
      return;
    }
    
    console.log('✅ All existing products cleared\n');
    
    // Now import fresh data
    const filePath = path.join(__dirname, '../public/LISTING 2025/LISTING.xlsx');
    console.log('Reading Excel file from:', filePath);
    
    const workbook = XLSX.readFile(filePath);
    
    const filtrationSystemMap = {
      'AIR': 'air',
      'GASOIL': 'gasoil', 
      'HUILE': 'huile'
    };
    
    let totalImported = 0;
    let totalErrors = 0;
    
    for (let i = 0; i < workbook.SheetNames.length; i++) {
      const sheetName = workbook.SheetNames[i];
      console.log(`\nProcessing sheet: "${sheetName}"`);
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const filtrationSystemKey = Object.keys(filtrationSystemMap).find(key => 
        sheetName.toUpperCase().includes(key)
      );
      const filtrationSystem = filtrationSystemKey ? filtrationSystemMap[filtrationSystemKey] : 'air';
      
      console.log(`Filtration system: ${filtrationSystem}`);
      console.log(`Processing ${jsonData.length} rows...`);
      
      // Process in batches of 100
      const batchSize = 100;
      for (let j = 0; j < jsonData.length; j += batchSize) {
        const batch = jsonData.slice(j, j + batchSize);
        const products = batch.map(row => mapExcelRowToProduct(row, filtrationSystem));
        
        const { data, error } = await supabase
          .from('products')
          .insert(products);
        
        if (error) {
          console.error(`Error inserting batch ${Math.floor(j/batchSize) + 1}:`, error);
          totalErrors += batch.length;
        } else {
          console.log(`Successfully inserted batch ${Math.floor(j/batchSize) + 1} (${batch.length} products)`);
          totalImported += batch.length;
        }
      }
    }
    
    console.log(`\n=== FRESH IMPORT COMPLETE ===`);
    console.log(`Total products imported: ${totalImported}`);
    console.log(`Total errors: ${totalErrors}`);
    
    // Verify final count
    const { count: finalCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`Final database count: ${finalCount}`);
    }
    
  } catch (error) {
    console.error('Error during fresh import:', error.message);
  }
}

freshImport();
