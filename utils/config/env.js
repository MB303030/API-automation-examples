import http from 'k6/http';
import { check, sleep } from 'k6';
import { getProductsEndpoint } from '../../utils/config/endpoints.js';

/**
 * DummyJSON API Performance Test
 * Uses existing helper files
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
  // Use your existing helper - this is the clean way!
  const productsUrl = getProductsEndpoint(5, 10);
  
  // Test 1: Get products with pagination
  const products = http.get(productsUrl);
  
  // Test 2: Get random single product (no helper needed for this pattern)
  const productId = Math.floor(Math.random() * 100) + 1;
  const singleProduct = http.get(`https://dummyjson.com/products/${productId}`);
  
  // Test 3: Search products (could add helper later if needed)
  const search = http.get('https://dummyjson.com/products/search?q=phone');
  
  // Validate all responses
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
    'product has valid data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.id && body.title && body.price;
      } catch {
        return false;
      }
    },
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
  
  sleep(1); // Realistic pause between user actions
}