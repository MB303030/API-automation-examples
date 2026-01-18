import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * SPIKE TEST - DummyJSON API
 * Purpose: Test how API handles sudden traffic bursts
 * Simulates: Flash sale, viral content, breaking news
 */
export const options = {
  // SPIKE pattern: Sudden burst then recovery
  stages: [
    { duration: '30s', target: 10 },    // Normal: 10 users
    { duration: '1m', target: 200 },    // SPIKE: 10→200 users suddenly!
    { duration: '30s', target: 200 },   // Hold spike
    { duration: '1m', target: 50 },     // Recovery: 200→50 users
    { duration: '30s', target: 10 },    // Back to normal
  ],
  
  // Spike test thresholds (tolerant of temporary degradation)
  thresholds: {
    http_req_duration: ['p(95)<1000'],  // Allow 1s during spike
    http_req_failed: ['rate<0.05'],     // Allow 5% failures during spike
    http_reqs: ['rate>200'],            // Expect high throughput
  },
};

export default function () {
  // During spike, users might refresh repeatedly
  const requestsPerUser = Math.random() < 0.3 ? 3 : 1; // 30% refresh multiple times
  
  for (let i = 0; i < requestsPerUser; i++) {
    // Spike scenario: Everyone tries to get limited products
    const limit = 5;
    const skip = Math.floor(Math.random() * 10); // First 10 pages
    
    const response = http.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`, {
      tags: { test: 'spike', request_type: 'product_listing' },
    });
    
    check(response, {
      'status is 200': (r) => r.status === 200,
      'response time < 2s': (r) => r.timings.duration < 2000,
    });
    
    // Very short think time during spike (users are frantic!)
    if (i < requestsPerUser - 1) {
      sleep(Math.random() * 0.5); // 0-0.5 seconds between rapid requests
    }
  }
  
  // Normal think time after burst
  sleep(Math.random() * 1 + 0.5); // 0.5-1.5 seconds
}