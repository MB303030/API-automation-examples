import http from 'k6/http';
import { check } from 'k6';

/**
 * Smoke test for DummyJSON API
 * Tests basic API availability
 */
export const options = {
  vus: 2,            // 2 virtual users
  duration: '30s',   // 30 seconds
  
  thresholds: {
    http_req_failed: ['rate<0.01'],    // Less than 1% failures
    http_req_duration: ['p(95)<2000'], // 95% under 2 seconds
  },
};

export default function () {
  // Test the products endpoint (from your curl command)
  const response = http.get('https://dummyjson.com/products?limit=5&skip=10');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has products': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.products && body.products.length === 5;
      } catch {
        return false;
      }
    },
    'response time < 2s': (r) => r.timings.duration < 2000,
  });
}