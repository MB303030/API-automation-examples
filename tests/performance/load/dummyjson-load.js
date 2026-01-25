import http from 'k6/http';
import { check, sleep } from 'k6';

import {
  getProductsEndpoint,
  getProductByIdEndpoint,
  searchProductsEndpoint
} from '../../../utils/config/endpoints.js';

import {
  hasStatus,
  hasArray,
  hasArrayWithItems,
  hasRequiredFields,
  weightedRandom,
  randomFrom,
  randomInt,
} from '../../../utils/core/k6-helpers.js';

const trafficData = JSON.parse(
  open('../../../test-data/trafficPatterns.json')
);

export const options = {
  stages: trafficData.patterns.load_test_normal.stages,
  thresholds: {
    http_req_duration: trafficData.thresholds.load.http_req_duration,
    http_req_failed: trafficData.thresholds.load.http_req_failed,
    http_reqs: trafficData.thresholds.load.http_reqs,
    checks: trafficData.thresholds.load.checks,
  }
};

// Test data
const SEARCH_TERMS = ['phone', 'laptop', 'shirt', 'watch', 'book', 'shoe', 'jacket'];
const PRODUCT_REQUIRED_FIELDS = ['id', 'title', 'price'];

// Scenario weights (must sum to 100)
const SCENARIO_WEIGHTS = {
  browse: 60,   // Product browsing
  detail: 25,   // Product detail view
  search: 15,   // Product search (adjusted from 10 to fill 100%)
};

// Scenario handlers
function browseProducts() {
  const limit = randomInt(1, 20);
  const skip = randomInt(0, 100);

  const response = http.get(getProductsEndpoint(limit, skip), {
    tags: { scenario: 'browse_products' },
  });

  check(response, {
    'browse status 200': hasStatus(200),
    'browse has products array': hasArray('products'),
  });
}

function viewProductDetail() {
  const productId = randomInt(1, 100);
  
  const response = http.get(getProductByIdEndpoint(productId), {
    tags: { scenario: 'view_product' },
  });

  check(response, {
    'product detail status 200': hasStatus(200),
    'product has valid data': hasRequiredFields(PRODUCT_REQUIRED_FIELDS),
  });
}

function searchProducts() {
  const searchTerm = randomFrom(SEARCH_TERMS);
  
  const response = http.get(searchProductsEndpoint(searchTerm), {
    tags: { scenario: 'search_products' },
  });

  check(response, {
    'search status 200': hasStatus(200),
    'search has results': hasArray('products'),
  });
}

// Main test function
export default function () {
  // Select ONE scenario based on weighted probability
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

  // Think time: 2-5 seconds (uniform distribution)
  const thinkTime = 2 + Math.random() * 3;
  sleep(thinkTime);
}
