// tests/performance/smoke/dummyjson-smoke-simple.js
import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * SIMPLE SMOKE TEST - No file dependencies
 */
export const options = {
  stages: [
    { duration: '15s', target: 1 },
    { duration: '30s', target: 3 },
    { duration: '45s', target: 5 },
    { duration: '20s', target: 0 }
  ],
  
  thresholds: {
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
    http_req_failed: ['rate<0.02'],
    checks: ['rate>0.95']
  },
};

export default function () {
  // Helper function to replace getApiUrl
  function getDummyJsonUrl(path) {
    return `https://dummyjson.com${path}`;
  }
  
  // TEST 1: GET PRODUCTS LIST
  const productsResponse = http.get(getDummyJsonUrl('/products?limit=5&skip=0'), {
    tags: { scenario: 'smoke_browse' },
    timeout: '5s'
  });
  
  check(productsResponse, {
    'GET /products - status 200': (r) => r.status === 200,
    'GET /products - response < 1s': (r) => r.timings.duration < 1000,
    'GET /products - has products array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.products) && body.products.length > 0;
      } catch {
        return false;
      }
    },
  });
  
  // TEST 2: GET SINGLE PRODUCT
  const productId = Math.floor(Math.random() * 10) + 1;
  const productResponse = http.get(getDummyJsonUrl(`/products/${productId}`), {
    tags: { scenario: 'smoke_product' },
    timeout: '5s'
  });
  
  check(productResponse, {
    'GET /products/{id} - status 200': (r) => r.status === 200,
    'GET /products/{id} - response < 800ms': (r) => r.timings.duration < 800,
    'GET /products/{id} - has required fields': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.id && body.title && body.price && body.description && body.category;
      } catch {
        return false;
      }
    },
  });
  
  // Short think time
  sleep(0.5 + Math.random() * 1);
}