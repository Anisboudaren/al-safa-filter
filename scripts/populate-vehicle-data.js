const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://qbpgclcndalyzflariuv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGdjbGNuZGFseXpmbGFyaXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE3NDAsImV4cCI6MjA3MDA0Nzc0MH0.eZlhQh-FO4ndlTQu8LZpwyvs6DAr4EAWn71DX9278Mw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample vehicle data based on the compatibility list from the image
const vehicleData = [
  {
    brand: { name: 'dacia', display_name: 'DACIA' },
    engines: [
      {
        name: '1,6 LPG',
        displacement: '1,6',
        fuel_type: 'LPG'
      },
      {
        name: '1,6 SCE 115',
        displacement: '1,6',
        fuel_type: 'Gasoline',
        technology: 'SCE',
        power_output: '115'
      },
      {
        name: '1,6 HYBRID 140',
        displacement: '1,6',
        fuel_type: 'Hybrid',
        technology: 'HYBRID',
        power_output: '140'
      }
    ]
  },
  {
    brand: { name: 'hyundai', display_name: 'HYUNDAI' },
    engines: [
      {
        name: '1,0 T-GDI',
        displacement: '1,0',
        fuel_type: 'Gasoline',
        technology: 'T-GDI'
      },
      {
        name: '1,4',
        displacement: '1,4',
        fuel_type: 'Gasoline'
      },
      {
        name: '1,0 T-GDI HYBRID 48V',
        displacement: '1,0',
        fuel_type: 'Hybrid',
        technology: 'T-GDI HYBRID 48V'
      },
      {
        name: '1,4 MPI',
        displacement: '1,4',
        fuel_type: 'Gasoline',
        technology: 'MPI'
      }
    ]
  },
  {
    brand: { name: 'infiniti', display_name: 'INFINITI' },
    engines: [
      {
        name: '3,0 T AWD',
        displacement: '3,0',
        fuel_type: 'Gasoline',
        technology: 'T'
      },
      {
        name: '3,7',
        displacement: '3,7',
        fuel_type: 'Gasoline'
      },
      {
        name: '5,0',
        displacement: '5,0',
        fuel_type: 'Gasoline'
      },
      {
        name: '3,5 HYBRID',
        displacement: '3,5',
        fuel_type: 'Hybrid',
        technology: 'HYBRID'
      }
    ]
  }
];

const vehicleModels = {
  dacia: {
    '1,6 LPG': [
      { model: 'DOKKER', variant: '', body_style: '' },
      { model: 'DOKKER II', variant: '', body_style: '' },
      { model: 'LODGY', variant: '', body_style: '' }
    ],
    '1,6 SCE 115': [
      { model: 'DUSTER II', variant: '', body_style: '' },
      { model: 'DUSTER II', variant: '4X4', body_style: '' },
      { model: 'DUSTER II', variant: 'LPG', body_style: '' },
      { model: 'LODGY', variant: '', body_style: '' },
      { model: 'DOKKER II', variant: 'PICK-UP', body_style: '' }
    ],
    '1,6 HYBRID 140': [
      { model: 'DUSTER', variant: '', body_style: '' }
    ]
  },
  hyundai: {
    '1,0 T-GDI': [
      { model: 'I10', variant: '', body_style: '' },
      { model: 'I20 II', variant: '', body_style: '' },
      { model: 'I20 II', variant: 'ACTIVE', body_style: '' },
      { model: 'I20 II', variant: 'COUPE', body_style: '' },
      { model: 'I30', variant: '', body_style: '' },
      { model: 'I30', variant: '', body_style: 'BREAK' },
      { model: 'I30', variant: 'COUPE', body_style: '' },
      { model: 'I30', variant: 'FASTBACK', body_style: '' },
      { model: 'KONA', variant: '', body_style: '' }
    ],
    '1,4': [
      { model: 'I20 II', variant: '', body_style: '' },
      { model: 'I20 II', variant: 'ACTIVE', body_style: '' },
      { model: 'I20 II', variant: 'COUPE', body_style: '' },
      { model: 'I30', variant: '', body_style: '' },
      { model: 'I30', variant: '', body_style: 'BREAK' },
      { model: 'I30', variant: 'COUPE', body_style: '' }
    ],
    '1,0 T-GDI HYBRID 48V': [
      { model: 'I30', variant: '', body_style: '' },
      { model: 'I30', variant: '', body_style: 'BREAK' }
    ],
    '1,4 MPI': [
      { model: 'I30', variant: '', body_style: '' },
      { model: 'I30', variant: '', body_style: 'BREAK' }
    ]
  },
  infiniti: {
    '3,0 T AWD': [
      { model: 'Q60', variant: 'COUPE', body_style: '', drive_type: 'AWD' }
    ],
    '3,7': [
      { model: 'FX', variant: '35', body_style: '' },
      { model: 'FX', variant: '45', body_style: '' },
      { model: 'FX', variant: '50 AWD', body_style: '' },
      { model: 'G37', variant: 'COUPE', body_style: '' },
      { model: 'G37', variant: 'DECAPOTABLE', body_style: '' },
      { model: 'M35 H', variant: '', body_style: '' },
      { model: 'M37', variant: '', body_style: '' },
      { model: 'Q60', variant: 'COUPE', body_style: '' },
      { model: 'Q60', variant: 'DECAPOTABLE', body_style: '' },
      { model: 'Q70', variant: '', body_style: '' },
      { model: 'QX50', variant: '37 AWD', body_style: '' },
      { model: 'QX70', variant: 'AWD', body_style: '' }
    ],
    '5,0': [
      { model: 'QX70', variant: 'AWD', body_style: '' }
    ],
    '3,5 HYBRID': [
      { model: 'Q50', variant: '50 HYBRID', body_style: '' },
      { model: 'Q50', variant: '50 HYBRID AWD', body_style: '' },
      { model: 'Q50', variant: '50 RED', body_style: '' },
      { model: 'Q70', variant: '', body_style: '' }
    ]
  }
};

async function populateDatabase() {
  try {
    console.log('Starting database population...\n');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await supabase.from('product_compatibilities').delete().neq('id', 0);
    await supabase.from('vehicles').delete().neq('id', 0);
    await supabase.from('engines').delete().neq('id', 0);
    await supabase.from('brands').delete().neq('id', 0);

    let totalBrands = 0;
    let totalEngines = 0;
    let totalVehicles = 0;

    for (const brandData of vehicleData) {
      console.log(`\nProcessing brand: ${brandData.brand.display_name}`);
      
      // Insert brand
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .insert(brandData.brand)
        .select()
        .single();

      if (brandError) {
        console.error(`Error inserting brand ${brandData.brand.display_name}:`, brandError);
        continue;
      }

      totalBrands++;
      console.log(`  ✓ Brand created: ${brand.display_name}`);

      // Process engines for this brand
      for (const engineData of brandData.engines) {
        const { data: engine, error: engineError } = await supabase
          .from('engines')
          .insert({
            brand_id: brand.id,
            ...engineData
          })
          .select()
          .single();

        if (engineError) {
          console.error(`Error inserting engine ${engineData.name}:`, engineError);
          continue;
        }

        totalEngines++;
        console.log(`    ✓ Engine created: ${engine.name}`);

        // Process vehicles for this engine
        const brandKey = brandData.brand.name.toLowerCase();
        const vehicles = vehicleModels[brandKey]?.[engine.name] || [];
        
        for (const vehicleData of vehicles) {
          const { data: vehicle, error: vehicleError } = await supabase
            .from('vehicles')
            .insert({
              engine_id: engine.id,
              model_name: vehicleData.model,
              variant: vehicleData.variant || null,
              body_style: vehicleData.body_style || null,
              drive_type: vehicleData.drive_type || null
            })
            .select()
            .single();

          if (vehicleError) {
            console.error(`Error inserting vehicle ${vehicleData.model}:`, vehicleError);
            continue;
          }

          totalVehicles++;
          console.log(`      ✓ Vehicle created: ${vehicle.model_name} ${vehicle.variant || ''} ${vehicle.body_style || ''}`);
        }
      }
    }

    console.log('\n=== POPULATION COMPLETE ===');
    console.log(`Total brands created: ${totalBrands}`);
    console.log(`Total engines created: ${totalEngines}`);
    console.log(`Total vehicles created: ${totalVehicles}`);
    console.log('\nDatabase populated successfully!');

  } catch (error) {
    console.error('Error populating database:', error);
  }
}

// Run the population
populateDatabase();

