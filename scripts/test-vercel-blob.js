// Simple test to verify Vercel Blob is working
const { put } = require('@vercel/blob');

async function testVercelBlob() {
  try {
    console.log('Testing Vercel Blob connection...\n');
    
    // Check if token is available
    if (!process.env.Alsafa_READ_WRITE_TOKEN) {
      console.error('❌ Alsafa_READ_WRITE_TOKEN not found in environment variables');
      console.log('Please add it to your .env.local file:');
      console.log('Alsafa_READ_WRITE_TOKEN=your_token_here');
      return;
    }
    
    console.log('✅ Token found in environment variables');
    
    // Set the token for Vercel Blob
    process.env.BLOB_READ_WRITE_TOKEN = process.env.Alsafa_READ_WRITE_TOKEN;
    
    // Test upload
    const testContent = 'Hello from Vercel Blob test!';
    const testFileName = `test_${Date.now()}.txt`;
    
    console.log('Uploading test file:', testFileName);
    
    const blob = await put(testFileName, testContent, {
      access: 'public',
      contentType: 'text/plain'
    });
    
    console.log('✅ Upload successful!');
    console.log('URL:', blob.url);
    console.log('\n🎉 Vercel Blob is working correctly!');
    console.log('\nYou can now test image uploads in the admin panel.');
    
  } catch (error) {
    console.error('❌ Vercel Blob test failed:', error.message);
    
    if (error.message.includes('token')) {
      console.log('\nPossible solutions:');
      console.log('1. Check if Alsafa_READ_WRITE_TOKEN is correct');
      console.log('2. Make sure the token has the right permissions');
      console.log('3. Verify the token is in your .env.local file');
    }
  }
}

testVercelBlob();
