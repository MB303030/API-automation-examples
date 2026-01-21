// tests/experimental/debug-imports.js
import http from 'k6/http';
import { check } from 'k6';

// Try ALL possible import paths
console.log('=== DEBUGGING IMPORTS ===');

try {
  console.log('1. Trying: ../../../utils/config/endpoints.js');
  const module1 = await import('../../../utils/config/endpoints.js');
  console.log('✅ SUCCESS! Module loaded');
  console.log('   Exported functions:', Object.keys(module1));
} catch (e1) {
  console.log('❌ FAILED:', e1.message);
}

try {
  console.log('\n2. Trying: /utils/config/endpoints.js (absolute)');
  const module2 = await import('/utils/config/endpoints.js');
  console.log('✅ SUCCESS!');
} catch (e2) {
  console.log('❌ FAILED:', e2.message);
}

try {
  console.log('\n3. Trying: ../../config/endpoints.js');
  const module3 = await import('../../config/endpoints.js');
  console.log('✅ SUCCESS!');
} catch (e3) {
  console.log('❌ FAILED:', e3.message);
}

try {
  console.log('\n4. Trying: ../../utils/config/endpoints.js');
  const module4 = await import('../../utils/config/endpoints.js');
  console.log('✅ SUCCESS!');
} catch (e4) {
  console.log('❌ FAILED:', e4.message);
}

// Try to open traffic patterns
console.log('\n=== DEBUGGING FILE ACCESS ===');
try {
  console.log('5. Trying to open: test-data/trafficPatterns.json');
  const content = open('test-data/trafficPatterns.json');
  const data = JSON.parse(content);
  console.log('✅ SUCCESS! File loaded and parsed');
  console.log('   Keys:', Object.keys(data));
} catch (e) {
  console.log('❌ FAILED:', e.message);
}

export default function() {
  console.log('Test completed');
}