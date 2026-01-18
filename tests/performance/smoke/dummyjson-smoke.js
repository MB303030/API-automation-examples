import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * REAL Performance Test - DummyJSON API
 * Tests: Response time degradation under increasing load
 */
export const options = {
  // Realistic load pattern: Simulate 100 users over 5 minutes
  stages: [
    // Ramp-up: Gradually increase users (simulates morning traffic)
    { duration: '1m', target: 20 },   // 0→20 users in 1 minute
    { duration: '1m', target: 50 },   // 20→50 users in 1 minute
    { duration: '1m', target: 100 },  // 50→100 users in 1 minute
    
    // Sustained load: Keep at 100 users for 2 minutes
    { duration: '2m', target: 100 },  // Stay at 100 users
    
    // Ramp-down: Gradually decrease users
    { duration: '1m', target: 20 },   // 100→20 users
    { duration: '1m', target: 0 },    // 20→0 users
  ],
  
  // Realistic thresholds for production API
  thresholds: {
    // 95% of requests should be under 500ms (not 2000ms!)
    http_req_duration: ['p(95)<500'],
    
    // Less than 0.5% failures (stricter!)
    http_req_failed: ['rate<0.005'],
    
    // At least 50 requests per second throughput
    http_reqs: ['rate>50'],
  },
};

export default function () {
  // More realistic user behavior:
  
  // 70% chance: Get products page
  if (Math.random() < 0.7) {
    const limit = Math.floor(Math.random() * 10) + 1; // 1-10 products
    const skip = Math.floor(Math.random() * 50);      // Random page
    const products = http.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
    
    check(products, {
      'products status 200': (r) => r.status === 200,
    });
  }
  
  // 20% chance: View specific product
  if (Math.random() < 0.2) {
    const productId = Math.floor(Math.random() * 100) + 1;
    const singleProduct = http.get(`https://dummyjson.com/products/${productId}`);
    
    check(singleProduct, {
      'product status 200': (r) => r.status === 200,
    });
  }
  
  // 10% chance: Search for products
  if (Math.random() < 0.1) {
    const searchTerms = ['phone', 'laptop', 'shirt', 'watch', 'book'];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const search = http.get(`https://dummyjson.com/products/search?q=${randomTerm}`);
    
    check(search, {
      'search status 200': (r) => r.status === 200,
    });
  }
  
  // Realistic think time: Users don't spam requests
  // Random pause between 1-3 seconds (reading time)
  sleep(Math.random() * 2 + 1);
}