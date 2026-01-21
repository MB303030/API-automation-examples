import http from 'k6/http';
import { check, sleep } from 'k6';

import {
  getProductsEndpoint,
  getProductByIdEndpoint,
  searchProductsEndpoint
} from '../../../utils/config/endpoints.js';

const trafficData = JSON.parse(
  open('../../../test-data/trafficPatterns.json')
);

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
