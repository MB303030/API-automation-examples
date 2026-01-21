import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * SPIKE TEST - DummyJSON API
 * Tests: How API handles sudden traffic bursts
 */

// Load ALL data from file
const trafficData = JSON.parse(open('../../test-data/trafficPatterns.json'));

export const options = {
  // Use spike stages from file
  stages: trafficData.patterns.spike_test.stages,
  
  // Use spike thresholds from file
  thresholds: trafficData.thresholds.spike,
};

export default function () {
  // SPIKE PATTERN: During flash sales, users mostly check POPULAR items
  
  // 80% chance: Get FIRST PAGE of products (not random page!)
  if (Math.random() < 0.8) {
    // During spikes, users go to first page (skip=0), not random pages
    const limit = Math.floor(Math.random() * 5) + 1; // 1-5 products
    const products = http.get(`https://dummyjson.com/products?limit=${limit}&skip=0`); // ALWAYS page 1
    
    check(products, {
      'products status 200': (r) => r.status === 200,
    });
  }
  
  // 40% chance: View SPECIFIC popular product (not random!)
  if (Math.random() < 0.4) {
    // During spikes, users check TOP 10 products, not random 1-100
    const popularProducts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Top 10 products
    const productId = popularProducts[Math.floor(Math.random() * popularProducts.length)];
    
    const singleProduct = http.get(`https://dummyjson.com/products/${productId}`);
    
    check(singleProduct, {
      'product status 200': (r) => r.status === 200,
    });
  }
  
  // 30% chance: Search for POPULAR terms (not random!)
  if (Math.random() < 0.3) {
    const popularSearchTerms = ['phone', 'laptop', 'sale']; // Only popular terms during spike
    const randomTerm = popularSearchTerms[Math.floor(Math.random() * popularSearchTerms.length)];
    
    const search = http.get(`https://dummyjson.com/products/search?q=${randomTerm}`);
    
    check(search, {
      'search status 200': (r) => r.status === 200,
    });
  }
  
  // SPIKE think time: Very short (users spam!)
  sleep(Math.random() * 0.9 + 0.1); // 0.1-1 second
}