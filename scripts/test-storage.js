const { createClient } = require('@supabase/supabase-js');

// Use the service role key for admin operations
const supabaseUrl = 'https://qbpgclcndalyzflariuv.supabase.co';
const supabaseServiceKey = 'Alsafa_READ_WRITE_TOKEN'; // Your service role key

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testStorage() {
  try {
    console.log('Testing Supabase Storage...\n');

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }

    console.log('Available buckets:', buckets.map(b => b.name));

    const bucketExists = buckets.some(bucket => bucket.name === 'product-images');
    
    if (bucketExists) {
      console.log('✅ product-images bucket exists');
      
      // Test upload a small file
      console.log('\nTesting file upload...');
      const testContent = 'test file content';
      const testFileName = `test_${Date.now()}.txt`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(testFileName, testContent, {
          contentType: 'text/plain'
        });

      if (uploadError) {
        console.error('Upload test failed:', uploadError);
      } else {
        console.log('✅ Upload test successful:', uploadData);
        
        // Clean up test file
        await supabase.storage
          .from('product-images')
          .remove([testFileName]);
        console.log('✅ Test file cleaned up');
      }
      
    } else {
      console.log('❌ product-images bucket does not exist');
      console.log('Creating bucket...');
      
      const { data, error } = await supabase.storage.createBucket('product-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('✅ Created product-images bucket:', data);
      }
    }

  } catch (error) {
    console.error('Error testing storage:', error.message);
  }
}

testStorage();
