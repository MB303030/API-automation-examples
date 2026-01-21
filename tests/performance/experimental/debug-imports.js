// tests/experimental/debug-imports-fixed.js
console.log('=== DEBUGGING IMPORTS FIXED ===\n');

// Helper to test imports
async function testImport(path, description) {
  console.log(`Testing: ${description}`);
  console.log(`Path: ${path}`);
  
  try {
    const module = await import(path);
    console.log(`✅ SUCCESS! Module loaded`);
    console.log(`   Exported functions: ${Object.keys(module).join(', ')}`);
    
    // Test if functions work
    if (module.getProductsEndpoint) {
      const url = module.getProductsEndpoint(5, 0);
      console.log(`   Sample URL: ${url}`);
    }
    
    return true;
  } catch (e) {
    console.log(`❌ FAILED: ${e.message || 'Unknown error'}`);
    if (e.stack) {
      console.log(`   Stack: ${e.stack.split('\n')[0]}`);
    }
    return false;
  }
}

// Helper to test file access
function testFileAccess(path, description) {
  console.log(`\nTesting file: ${description}`);
  console.log(`Path: ${path}`);
  
  try {
    const content = open(path);
    const data = JSON.parse(content);
    console.log(`✅ SUCCESS! File loaded`);
    console.log(`   Keys: ${Object.keys(data).join(', ')}`);
    return true;
  } catch (e) {
    console.log(`❌ FAILED: ${e.message}`);
    return false;
  }
}

// Main test function
export default async function() {
  console.log('Starting import tests...\n');
  
  // Test imports from different paths
  const importTests = [
    { path: '../../../utils/config/endpoints.js', desc: 'From tests/experimental/' },
    { path: '../../utils/config/endpoints.js', desc: 'Alternative path' },
    { path: 'utils/config/endpoints.js', desc: 'From project root' },
    { path: './utils/config/endpoints.js', desc: 'From project root with ./' },
  ];
  
  let anyImportWorked = false;
  for (const test of importTests) {
    const worked = await testImport(test.path, test.desc);
    if (worked) anyImportWorked = true;
    console.log('---');
  }
  
  // Test file access
  console.log('\n=== TESTING FILE ACCESS ===');
  const fileTests = [
    { path: 'test-data/trafficPatterns.json', desc: 'Traffic patterns' },
    { path: './test-data/trafficPatterns.json', desc: 'Traffic patterns with ./' },
    { path: '../test-data/trafficPatterns.json', desc: 'From parent dir' },
  ];
  
  for (const test of fileTests) {
    testFileAccess(test.path, test.desc);
    console.log('---');
  }
  
  // Summary
  console.log('\n=== SUMMARY ===');
  if (anyImportWorked) {
    console.log('✅ At least one import path works!');
  } else {
    console.log('❌ No import paths worked. Check file locations and syntax.');
  }
  
  console.log('\nTest completed');
}