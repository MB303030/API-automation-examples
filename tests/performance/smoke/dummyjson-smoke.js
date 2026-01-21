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
  // SPIKE BEHAVIOR: Users are frantic during flash sales!
  
  // 80% chance: Get products page (higher than normal)
  if (Math.random() < 0.8) {
    const limit = Math.floor(Math.random() * 5) + 1; // 1-5 products
    const skip = Math.floor(Math.random() * 20);     // First 20 pages
    const products = http.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
    
    check(products, {
      'products status 200': (r) => r.status === 200,
    });
  }
  
  // 40% chance: View specific product (higher than normal)
  if (Math.random() < 0.4) {
    const productId = Math.floor(Math.random() * 20) + 1; // First 20 products
    const singleProduct = http.get(`https://dummyjson.com/products/${productId}`);
    
    check(singleProduct, {
      'product status 200': (r) => r.status === 200,
    });
  }
  
  // 30% chance: Search for products (higher than normal)
  if (Math.random() < 0.3) {
    const searchTerms = ['phone', 'laptop', 'sale', 'discount'];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const search = http.get(`https://dummyjson.com/products/search?q=${randomTerm}`);
    
    check(search, {
      'search status 200': (r) => r.status === 200,
    });
  }
  
  // SPIKE think time: Very short (users spam!)
  sleep(Math.random() * 0.9 + 0.1); // 0.1-1 second
}