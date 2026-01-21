import http from 'k6/http';
import { check, sleep } from 'k6';
import { 
  getProductsEndpoint,
  getProductByIdEndpoint,
  searchProductsEndpoint,
  getAllCategoriesEndpoint
} from '../../../utils/config/endpoints.js';

// Load traffic patterns from file
const trafficData = JSON.parse(open('../../../test-data/trafficPatterns.json'));

/**
 * SMOKE TEST - DummyJSON API
 * Purpose: Quick health check to verify API is working
 * Duration: 2 minutes with minimal load
 */
export const options = {
  // Use smoke_test stages from configuration file (2 minutes total)
  stages: trafficData.patterns.smoke_test.stages,
  
  // Use smoke thresholds from configuration file
  thresholds: trafficData.thresholds.smoke,
};

/**
 * COMPREHENSIVE SMOKE TEST - Tests all critical endpoints
 */
export default function () {
  // TEST 1: GET PRODUCTS LIST (Core functionality)
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
    },
    'GET /products - has pagination data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.total !== undefined && body.skip !== undefined && body.limit !== undefined;
      } catch {
        return false;
      }
    },
  });
  
  // TEST 2: GET SINGLE PRODUCT (Detailed view)
  const productId = Math.floor(Math.random() * 10) + 1; // Test products 1-10
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
    },
  });
  
  // TEST 3: SEARCH PRODUCTS (Search functionality)
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
    },
  });
  
  // TEST 4: GET ALL CATEGORIES (Category listing)
  const categoriesResponse = http.get(getAllCategoriesEndpoint(), {
    tags: { scenario: 'smoke_categories' },
    timeout: '5s'
  });
  
  check(categoriesResponse, {
    'GET /products/categories - status 200': (r) => r.status === 200,
    'GET /products/categories - response < 1.5s': (r) => r.timings.duration < 1500,
    'GET /products/categories - returns array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body) && body.length > 0;
      } catch {
        return false;
      }
    },
  });
  
  // Realistic think time - users don't spam requests
  sleep(0.5 + Math.random() * 1); // 0.5-1.5 seconds
}