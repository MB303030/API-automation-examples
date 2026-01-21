import http from 'k6/http';
import { check, sleep } from 'k6';
import { 
  getProductsEndpoint,
  getProductByIdEndpoint,
  searchProductsEndpoint 
} from '../../../utils/config/endpoints.js';

// Load traffic patterns from file
const trafficData = JSON.parse(open('../../../test-data/trafficPatterns.json'));

/**
 * LOAD TEST - DummyJSON API
 * Purpose: Test API performance under sustained realistic load
 * Using traffic patterns from configuration file
 */
export const options = {
  // Use load_test_normal stages from configuration file (15 minutes total)
  stages: trafficData.patterns.load_test_normal.stages,
  
  // Use load thresholds from configuration file with additional custom thresholds
  thresholds: {
    // Response time thresholds from config file
    http_req_duration: trafficData.thresholds.load.http_req_duration,
    
    // Failure rate threshold from config file
    http_req_failed: trafficData.thresholds.load.http_req_failed,
    
    // Additional custom thresholds from original test
    http_reqs: ['rate>100'],           // Throughput requirement
    checks: ['rate>0.99'],            // Data validation requirement
  },
};

/**
 * Realistic user behavior simulation
 * Each virtual user represents a real website visitor
 */
export default function () {
  // REAL USER SCENARIO 1: Product Browsing (60% of users)
  if (Math.random() < 0.6) {
    // Browse products with pagination
    const limit = Math.floor(Math.random() * 20) + 1;  // 1-20 products
    const skip = Math.floor(Math.random() * 100);      // Random page 0-99
    
    const productsResponse = http.get(getProductsEndpoint(limit, skip), {
      tags: { scenario: 'browse_products' },
    });
    
    check(productsResponse, {
      'browse status 200': (r) => r.status === 200,
      'browse has products array': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body.products);
        } catch {
          return false;
        }
      },
      'browse response < 500ms': (r) => r.timings.duration < 500,
    });
  }
  
  // REAL USER SCENARIO 2: Product Detail View (25% of users)
  if (Math.random() < 0.25) {
    // View specific product details
    const productId = Math.floor(Math.random() * 100) + 1;
    
    const productResponse = http.get(getProductByIdEndpoint(productId), {
      tags: { scenario: 'view_product', productId: productId },
    });
    
    check(productResponse, {
      'product detail status 200': (r) => r.status === 200,
      'product has valid data': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.id && body.title && body.price;
        } catch {
          return false;
        }
      },
      'product response < 400ms': (r) => r.timings.duration < 400,
    });
  }
  
  // REAL USER SCENARIO 3: Product Search (10% of users)
  if (Math.random() < 0.1) {
    // Search for products
    const searchTerms = ['phone', 'laptop', 'shirt', 'watch', 'book', 'shoe', 'jacket'];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    const searchResponse = http.get(searchProductsEndpoint(randomTerm), {
      tags: { scenario: 'search_products', term: randomTerm },
    });
    
    check(searchResponse, {
      'search status 200': (r) => r.status === 200,
      'search has results': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.products && body.products.length > 0;
        } catch {
          return false;
        }
      },
      'search response < 600ms': (r) => r.timings.duration < 600,
    });
  }
  
  // REAL USER SCENARIO 4: Category Browsing (5% of users)
  if (Math.random() < 0.05) {
    // Browse by category
    const categories = ['smartphones', 'laptops', 'fragrances', 'skincare', 'groceries'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const categoryResponse = http.get(
      `https://dummyjson.com/products/category/${randomCategory}`,
      { tags: { scenario: 'browse_category', category: randomCategory } }
    );
    
    check(categoryResponse, {
      'category status 200': (r) => r.status === 200,
      'category has products': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.products && body.products.length > 0;
        } catch {
          return false;
        }
      },
    });
  }
  
  // REALISTIC THINK TIME: Users don't spam requests
  // Random pause between 2-5 seconds (reading/thinking time)
  const thinkTime = Math.random() * 3 + 2; // 2-5 seconds
  sleep(thinkTime);
  
  // OCCASIONAL MULTI-PAGE SESSION (20% chance user does another action)
  if (Math.random() < 0.2) {
    // User clicks "related products" or "similar items"
    const relatedProductId = Math.floor(Math.random() * 100) + 1;
    const relatedResponse = http.get(getProductByIdEndpoint(relatedProductId), {
      tags: { scenario: 'related_product', followUp: true },
    });
    
    check(relatedResponse, {
      'related product status 200': (r) => r.status === 200,
    });
    
    sleep(1); // Quick look at related product
  }
}

/**
 * WHAT THIS LOAD TEST MEASURES:
 * 
 * 1. SUSTAINED PERFORMANCE: Can API handle 15 minutes of continuous load?
 * 2. SCALABILITY: How does response time change as users increase?
 * 3. MIXED WORKLOAD: Realistic mix of different API calls
 * 4. DATA CONSISTENCY: Are responses valid under load?
 * 5. MEMORY LEAKS: Does performance degrade over time?
 * 
 * CONFIGURATION USED:
 * - Pattern: load_test_normal (15 minutes total)
 * - Stages: 2m@20 → 3m@50 → 5m@100 → 3m@50 → 2m@20
 * - Response Time Threshold: p(95) < 300ms
 * - Failure Rate Threshold: < 0.5%
 * 
 * EXPECTED RESULTS:
 * - Total requests: 20,000-35,000
 * - Avg throughput: 20-35 req/sec
 * - Response times should stay consistent
 * - Success rate should remain >99.5%
 */