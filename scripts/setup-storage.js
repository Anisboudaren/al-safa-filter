const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://qbpgclcndalyzflariuv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGdjbGNuZGFseXpmbGFyaXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE3NDAsImV4cCI6MjA3MDA0Nzc0MH0.eZlhQh-FO4ndlTQu8LZpwyvs6DAr4EAWn71DX9278Mw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  try {
    console.log('Setting up Supabase storage for product images...\n');

    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }

    const bucketExists = buckets.some(bucket => bucket.name === 'product-images');
    
    if (bucketExists) {
      console.log('✅ product-images bucket already exists');
    } else {
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket('product-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (error) {
        console.error('Error creating bucket:', error);
        return;
      }

      console.log('✅ Created product-images bucket');
    }

    // Set up RLS policies for the bucket
    console.log('\nSetting up RLS policies...');

    // Policy to allow public read access
    const { error: readPolicyError } = await supabase.rpc('create_policy_if_not_exists', {
      policy_name: 'Allow public read access to product images',
      table_name: 'storage.objects',
      policy_definition: 'bucket_id = \'product-images\'',
      policy_check: 'true',
      policy_roles: 'public',
      policy_cmd: 'SELECT'
    });

    if (readPolicyError) {
      console.log('Note: RLS policies may need to be set up manually in Supabase dashboard');
      console.log('Error:', readPolicyError.message);
    } else {
      console.log('✅ RLS policies configured');
    }

    console.log('\n🎉 Storage setup complete!');
    console.log('\nNext steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to Storage > Policies');
    console.log('3. Create a policy for the product-images bucket:');
    console.log('   - Policy name: Allow public read access');
    console.log('   - Target roles: public');
    console.log('   - Operation: SELECT');
    console.log('   - Policy definition: bucket_id = \'product-images\'');

  } catch (error) {
    console.error('Error setting up storage:', error.message);
  }
}

setupStorage();
