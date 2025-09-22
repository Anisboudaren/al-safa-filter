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

async function examineAndImportExcel() {
  try {
    const filePath = path.join(__dirname, '../public/LISTING 2025/LISTING.xlsx');
    console.log('Reading Excel file from:', filePath);
    
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    console.log('\n=== EXCEL FILE ANALYSIS ===');
    console.log('Sheet names:', workbook.SheetNames);
    
    // Define filtration systems based on sheet names
    const filtrationSystemMap = {
      'AIR': 'air',
      'GASOIL': 'gasoil', 
      'HUILE': 'huile'
    };
    
    // Analyze each sheet
    for (let i = 0; i < workbook.SheetNames.length; i++) {
      const sheetName = workbook.SheetNames[i];
      console.log(`\n--- Sheet ${i + 1}: "${sheetName}" ---`);
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log('Total rows:', jsonData.length);
      
      if (jsonData.length > 0) {
        console.log('Headers:', Object.keys(jsonData[0]));
        
        // Determine filtration system
        const filtrationSystem = Object.keys(filtrationSystemMap).find(key => 
          sheetName.toUpperCase().includes(key)
        ) ? filtrationSystemMap[Object.keys(filtrationSystemMap).find(key => 
          sheetName.toUpperCase().includes(key)
        )] : 'air';
        
        console.log('Detected filtration system:', filtrationSystem);
        
        // Show sample mapped data
        if (jsonData.length > 0) {
          console.log('\nSample mapped product (first row):');
          const sampleProduct = mapExcelRowToProduct(jsonData[0], filtrationSystem);
          console.log(JSON.stringify(sampleProduct, null, 2));
        }
        
        // Show first few original rows for comparison
        console.log('\nFirst 3 original rows:');
        for (let j = 0; j < Math.min(3, jsonData.length); j++) {
          console.log(`Row ${j + 1}:`, jsonData[j]);
        }
      }
    }
    
    console.log('\n=== ANALYSIS COMPLETE ===');
    console.log('\nTo import data to database, run: node scripts/import-excel-to-db.js --import');
    
  } catch (error) {
    console.error('Error reading Excel file:', error.message);
  }
}

async function importToDatabase() {
  try {
    const filePath = path.join(__dirname, '../public/LISTING 2025/LISTING.xlsx');
    console.log('Importing Excel data to database...');
    
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
    
    console.log(`\n=== IMPORT COMPLETE ===`);
    console.log(`Total products imported: ${totalImported}`);
    console.log(`Total errors: ${totalErrors}`);
    
  } catch (error) {
    console.error('Error importing to database:', error.message);
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--import')) {
  importToDatabase();
} else {
  examineAndImportExcel();
}
