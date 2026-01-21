// tests/smoke/dummyjson-smoke-nodeps.js
import http from 'k6/http';
import { check, sleep } from 'k6';

// Define endpoints locally
function getProductsEndpoint(limit = 30, skip = 0) {
  return `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
}

function getProductByIdEndpoint(id) {
  return `https://dummyjson.com/products/${id}`;
}

function searchProductsEndpoint(term) {
  return `https://dummyjson.com/products/search?q=${encodeURIComponent(term)}`;
}

function getAllCategoriesEndpoint() {
  return 'https://dummyjson.com/products/categories';
}

// Hardcode traffic patterns
const trafficData = {
  patterns: {
    smoke_test: {
      stages: [
        { duration: '15s', target: 1 },
        { duration: '30s', target: 3 },
        { duration: '45s', target: 5 },
        { duration: '20s', target: 0 }
      ]
    }
  },
  thresholds: {
    smoke: {
      http_req_duration: ['p(95)<800', 'p(99)<1500'],
      http_req_failed: ['rate<0.02'],
      checks: ['rate>0.95']
    }
  }
};

export const options = {
  stages: trafficData.patterns.smoke_test.stages,
  thresholds: trafficData.thresholds.smoke,
};

export default function () {
  // TEST 1: GET PRODUCTS LIST
  const productsResponse = http.get(getProductsEndpoint(5, 0), {
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
    }
  });
  
  // TEST 2: GET SINGLE PRODUCT
  const productId = Math.floor(Math.random() * 10) + 1;
  const productResponse = http.get(getProductByIdEndpoint(productId), {
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
    }
  });
  
  // TEST 3: SEARCH PRODUCTS
  const searchTerms = ['phone', 'laptop', 'watch', 'shirt', 'book'];
  const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
  const searchResponse = http.get(searchProductsEndpoint(randomTerm), {
    tags: { scenario: 'smoke_search' },
    timeout: '5s'
  });
  
  check(searchResponse, {
    'GET /products/search - status 200': (r) => r.status === 200,
    'GET /products/search - response < 1.2s': (r) => r.timings.duration < 1200,
    'GET /products/search - has search results': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.products && Array.isArray(body.products);
      } catch {
        return false;
      }
    }
  });
  
  sleep(0.5 + Math.random() * 1);
}