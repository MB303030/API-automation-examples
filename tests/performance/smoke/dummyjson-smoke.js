import http from 'k6/http';
import { check, sleep } from 'k6';

import {
  getProductsEndpoint,
  getProductByIdEndpoint,
  searchProductsEndpoint,
  getAllCategoriesEndpoint
} from '../../../utils/config/endpoints.js';

const trafficData = JSON.parse(
  open('../../../test-data/trafficPatterns.json')
);

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
