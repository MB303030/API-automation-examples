import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

import {
  getProductsEndpoint,
  getProductByIdEndpoint,
  searchProductsEndpoint
} from '../../../utils/config/endpoints.js';

import {
  httpGet,
  hasStatus,
  hasArray,
  hasRequiredFields,
  weightedRandom,
  randomFrom,
  randomInt,
  randomFloat,
} from '../../../utils/core/k6-helpers.js';

const trafficData = JSON.parse(
  open('../../../test-data/trafficPatterns.json')
);

// Custom metric for tracking critical failures
const stressFailureRate = new Rate('stress_failure_rate');

// Define stress pattern - ramp up beyond normal capacity
const STRESS_PATTERN = [
  { duration: '2m', target: 1000 },   // Ramp up to normal peak
  { duration: '5m', target: 3000 },   // Push beyond capacity (3x normal)
  { duration: '2m', target: 100 },    // Sharp drop to check recovery
  { duration: '1m', target: 0 },      // Cool down
];

export const options = {
  stages: trafficData.patterns.stress_test_ramp?.stages || STRESS_PATTERN,
  thresholds: {
    // Lenient thresholds - we expect to breach these
    http_req_duration: ['p(95)<10000'],  // 10 seconds vs 2 seconds in load test
    http_req_failed: ['rate<0.1'],       // Allow 10% errors vs 1% in load test
    checks: ['rate>0.7'],                // Allow 30% check failures
    'stress_failure_rate': ['rate<0.05'] // Alert if >5% critical failures
  },
};

// Same test data as load test
const SEARCH_TERMS = ['phone', 'laptop', 'shirt', 'watch', 'book', 'shoe', 'jacket'];
const PRODUCT_REQUIRED_FIELDS = ['id', 'title', 'price'];

// Same scenario weights as load test
const SCENARIO_WEIGHTS = {
  browse: 60,
  detail: 25,
  search: 15,
};

// Same handlers but with stress monitoring
function browseProducts() {
  const limit = randomInt(1, 20);
  const skip = randomInt(0, 100);

  const response = httpGet(getProductsEndpoint(limit, skip), {
    tags: { scenario: 'browse_products', test_type: 'stress' },
  });

  const passed = check(response, {
    'browse status 200': hasStatus(200),
    'browse has products array': hasArray('products'),
  });

  // Track if this is a critical failure (server error or timeout)
  const isCriticalFailure = response.status >= 500 || response.status === 0;
  stressFailureRate.add(isCriticalFailure);
  
  return passed;
}

function viewProductDetail() {
  const productId = randomInt(1, 100);
  
  const response = httpGet(getProductByIdEndpoint(productId), {
    tags: { scenario: 'view_product', test_type: 'stress' },
  });

  const passed = check(response, {
    'product detail status 200': hasStatus(200),
    'product has valid data': hasRequiredFields(PRODUCT_REQUIRED_FIELDS),
  });

  const isCriticalFailure = response.status >= 500 || response.status === 0;
  stressFailureRate.add(isCriticalFailure);
  
  return passed;
}

function searchProducts() {
  const searchTerm = randomFrom(SEARCH_TERMS);
  
  const response = httpGet(searchProductsEndpoint(searchTerm), {
    tags: { scenario: 'search_products', test_type: 'stress' },
  });

  const passed = check(response, {
    'search status 200': hasStatus(200),
    'search has results': hasArray('products'),
  });

  const isCriticalFailure = response.status >= 500 || response.status === 0;
  stressFailureRate.add(isCriticalFailure);
  
  return passed;
}

// Main test function - identical to load test
export default function () {
  const scenario = weightedRandom(SCENARIO_WEIGHTS);

  switch (scenario) {
    case 'browse':
      browseProducts();
      break;
    case 'detail':
      viewProductDetail();
      break;
    case 'search':
      searchProducts();
      break;
  }

  // Shorter think time for stress test (1-3 seconds vs 2-5 in load test)
  sleep(randomFloat(1, 3));
}