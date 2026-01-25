import http from 'k6/http';
import { check, sleep } from 'k6';

import {
  getProductsEndpoint,
  getProductByIdEndpoint,
  searchProductsEndpoint,
} from '../../../utils/config/endpoints.js';

import {
  hasStatus,
  responseUnder,
  hasArrayWithItems,
  hasArray,
  hasRequiredFields,
  randomFrom,
  randomInt,
} from '../../../utils/core/k6-helpers.js';

const trafficData = JSON.parse(
  open('../../../test-data/trafficPatterns.json')
);

export const options = {
  stages: trafficData.patterns.smoke_test.stages,
  thresholds: trafficData.thresholds.smoke,
};

// Test data
const SEARCH_TERMS = ['phone', 'laptop', 'watch', 'shirt', 'book'];
const PRODUCT_REQUIRED_FIELDS = ['id', 'title', 'price', 'description', 'category'];

export default function () {
  // TEST 1: GET PRODUCTS LIST
  const productsResponse = http.get(getProductsEndpoint(5, 0), {
    tags: { scenario: 'smoke_browse' },
    timeout: '5s'
  });

  check(productsResponse, {
    'GET /products - status 200': hasStatus(200),
    'GET /products - response < 1s': responseUnder(1000),
    'GET /products - has products array': hasArrayWithItems('products'),
  });

  // TEST 2: GET SINGLE PRODUCT
  const productId = randomInt(1, 10);
  const productResponse = http.get(getProductByIdEndpoint(productId), {
    tags: { scenario: 'smoke_product' },
    timeout: '5s'
  });

  check(productResponse, {
    'GET /products/{id} - status 200': hasStatus(200),
    'GET /products/{id} - response < 800ms': responseUnder(800),
    'GET /products/{id} - has required fields': hasRequiredFields(PRODUCT_REQUIRED_FIELDS),
  });

  // TEST 3: SEARCH PRODUCTS
  const searchTerm = randomFrom(SEARCH_TERMS);
  const searchResponse = http.get(searchProductsEndpoint(searchTerm), {
    tags: { scenario: 'smoke_search' },
    timeout: '5s'
  });

  check(searchResponse, {
    'GET /products/search - status 200': hasStatus(200),
    'GET /products/search - response < 1.2s': responseUnder(1200),
    'GET /products/search - has results array': hasArray('products'),
  });

  sleep(0.5 + Math.random() * 1);
}
