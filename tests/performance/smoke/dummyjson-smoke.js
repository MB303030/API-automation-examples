import http from 'k6/http';
import { check, sleep } from 'k6';  // Added sleep import

/**
 * Smoke test for DummyJSON API
 * Tests multiple endpoints
 */
export const options = {
  vus: 2,            // 2 virtual users
  duration: '30s',   // 30 seconds
  
  thresholds: {
    http_req_failed: ['rate<0.01'],    // Less than 1% failures
    http_req_duration: ['p(95)<2000'], // 95% under 2 seconds
  },
};

export default function () {
  // Test 1: Get products (pagination)
  const products = http.get('https://dummyjson.com/products?limit=5&skip=10');
  
  // Test 2: Get random single product
  const productId = Math.floor(Math.random() * 100) + 1;
  const singleProduct = http.get(`https://dummyjson.com/products/${productId}`);
  
  // Test 3: Search products
  const search = http.get('https://dummyjson.com/products/search?q=phone');
  
  // Validate responses
  check(products, {
    'products status 200': (r) => r.status === 200,
    'has 5 products': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.products && body.products.length === 5;
      } catch {
        return false;
      }
    },
  });
  
  check(singleProduct, {
    'single product status 200': (r) => r.status === 200,
  });
  
  check(search, {
    'search status 200': (r) => r.status === 200,
    'search has results': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.products && body.products.length > 0;
      } catch {
        return false;
      }
    },
  });
  
  sleep(1);
}