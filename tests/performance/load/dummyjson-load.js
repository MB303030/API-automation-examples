// tests/load/dummyjson-load-nodeps.js
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

// Hardcode traffic patterns
const trafficData = {
  patterns: {
    load_test_normal: {
      stages: [
        { duration: '2m', target: 10 },
        { duration: '2m', target: 30 },
        { duration: '4m', target: 80 },
        { duration: '3m', target: 120 },
        { duration: '2m', target: 60 },
        { duration: '2m', target: 20 }
      ]
    }
  },
  thresholds: {
    load: {
      http_req_duration: ['p(95)<500', 'p(99)<1000'],
      http_req_failed: ['rate<0.01'],
      checks: ['rate>0.98'],
      http_reqs: ['rate>50']
    }
  }
};

export const options = {
  stages: trafficData.patterns.load_test_normal.stages,
  thresholds: {
    http_req_duration: trafficData.thresholds.load.http_req_duration,
    http_req_failed: trafficData.thresholds.load.http_req_failed,
    http_reqs: ['rate>100'],
    checks: ['rate>0.99']
  }
};

export default function () {
  // REAL USER SCENARIO 1: Product Browsing (60% of users)
  if (Math.random() < 0.6) {
    const limit = Math.floor(Math.random() * 20) + 1;
    const skip = Math.floor(Math.random() * 100);
    
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
      }
    });
  }
  
  // REAL USER SCENARIO 2: Product Detail View (25% of users)
  if (Math.random() < 0.25) {
    const productId = Math.floor(Math.random() * 100) + 1;
    
    const productResponse = http.get(getProductByIdEndpoint(productId), {
      tags: { scenario: 'view_product' },
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
      }
    });
  }
  
  // REAL USER SCENARIO 3: Product Search (10% of users)
  if (Math.random() < 0.1) {
    const searchTerms = ['phone', 'laptop', 'shirt', 'watch', 'book', 'shoe', 'jacket'];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    const searchResponse = http.get(searchProductsEndpoint(randomTerm), {
      tags: { scenario: 'search_products' },
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
      }
    });
  }
  
  const thinkTime = Math.random() * 3 + 2;
  sleep(thinkTime);
}