import http from 'k6/http';
import { check, sleep } from 'k6';

import {
  getProductsEndpoint,
  getProductByIdEndpoint,
  searchProductsEndpoint,
  getProductsByCategoryEndpoint
} from '../../../utils/config/endpoints.js';

import {
  hasStatus,
  hasArray,
  hasRequiredFields,
  responseUnder,
  randomFrom,
  randomInt,
} from '../../../utils/core/k6-helpers.js';

const trafficData = JSON.parse(
  open('../../../test-data/trafficPatterns.json')
);

export const options = {
  stages: trafficData.patterns.spike_test.stages,
  thresholds: trafficData.thresholds.spike,
};

// Test data - popular items during spike events
const POPULAR_PRODUCT_IDS = [1, 2, 3, 4, 5];
const TRENDING_SEARCH_TERMS = ['phone', 'sale', 'discount', 'laptop'];
const POPULAR_CATEGORIES = ['smartphones', 'laptops', 'fragrances'];
const PRODUCT_REQUIRED_FIELDS = ['id', 'title', 'price'];

// Spike scenario handlers
function browseFirstPage() {
  const limit = randomInt(1, 5); // Small page for fast loading
  const response = http.get(getProductsEndpoint(limit, 0), {
    tags: { scenario: 'spike_browse' },
  });

  check(response, {
    'page loaded during spike': hasStatus(200),
    'fast spike response': responseUnder(1500),
    'has products data': hasArray('products'),
  });
}

function viewPopularProduct() {
  const productId = randomFrom(POPULAR_PRODUCT_IDS);
  const response = http.get(getProductByIdEndpoint(productId), {
    tags: { scenario: 'spike_product' },
  });

  check(response, {
    'popular product loaded': hasStatus(200),
    'product has valid data': hasRequiredFields(PRODUCT_REQUIRED_FIELDS),
  });
}

function searchTrending() {
  const term = randomFrom(TRENDING_SEARCH_TERMS);
  const response = http.get(searchProductsEndpoint(term), {
    tags: { scenario: 'spike_search' },
  });

  check(response, {
    'search successful during spike': hasStatus(200),
    'search has results': hasArray('products'),
  });
}

function browseCategory() {
  const category = randomFrom(POPULAR_CATEGORIES);
  const response = http.get(getProductsByCategoryEndpoint(category), {
    tags: { scenario: 'spike_category' },
  });

  check(response, {
    'category browse worked': hasStatus(200),
    'category has products': hasArray('products'),
  });
}

// Main test function
export default function () {
  // SPIKE BEHAVIOR: Flash sale or viral content scenario
  // During spikes, users perform rapid, overlapping actions
  
  // Simulate page refresh behavior (60% of users refresh 1-3 times)
  const refreshCount = Math.random() < 0.6 ? randomInt(1, 3) : 1;

  for (let i = 0; i < refreshCount; i++) {
    // SCENARIO 1: Browse first page (90% during spike)
    if (Math.random() < 0.9) {
      browseFirstPage();
    }

    // SCENARIO 2: View popular product (70% during spike)
    if (Math.random() < 0.7) {
      viewPopularProduct();
    }

    // SCENARIO 3: Search for trending items (50% during spike)
    if (Math.random() < 0.5) {
      searchTrending();
    }

    // SCENARIO 4: Browse by category (30% during spike)
    if (Math.random() < 0.3) {
      browseCategory();
    }

    // Very short pause between rapid actions during spike
    if (i < refreshCount - 1) {
      sleep(Math.random() * 0.2);
    }
  }

  // Short think time after spike activity (0.1-0.6 seconds)
  sleep(Math.random() * 0.5 + 0.1);
}
