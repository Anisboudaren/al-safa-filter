// Test script to verify image matching logic
const { getProductImageUrl } = require('../lib/image-utils.ts');

console.log('Testing image matching logic...\n');

// Test cases
const testCases = [
  { alsafa: 'FA-1501', system: 'air', expected: '/images/FAP/FA1501.jpg' },
  { alsafa: 'OBS-100', system: 'huile', expected: '/images/OBS/OBS100.jpg' },
  { alsafa: 'GBS-600', system: 'gasoil', expected: '/images/GBS/GBS600.jpg' },
  { alsafa: 'FAP-5001', system: 'air', expected: '/images/FAP/FAP5001.jpg' },
  { alsafa: 'FA-1500', system: 'air', expected: '/images/FAP/FA1500.jpg' },
  { alsafa: 'OBS-132', system: 'huile', expected: '/images/OBS/OBS132.jpg' },
];

testCases.forEach((test, index) => {
  const result = getProductImageUrl(test.alsafa, test.system);
  const status = result === test.expected ? '✅' : '❌';
  
  console.log(`Test ${index + 1}: ${status}`);
  console.log(`  ALSAFA: ${test.alsafa}`);
  console.log(`  System: ${test.system}`);
  console.log(`  Expected: ${test.expected}`);
  console.log(`  Got: ${result}`);
  console.log('');
});

console.log('Image matching test complete!');
