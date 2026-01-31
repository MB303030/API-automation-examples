import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import http from 'k6/http';

// 1. DEFINE CUSTOM METRICS - These will show in your graphs
const browseProductTime = new Trend('browse_product_time');
const getProductDetailTime = new Trend('get_product_detail_time');
const criticalApiTime = new Trend('critical_api_time');

// 2. DEFINE TEST OPTIONS
export const options = {
  stages: [
    { duration: '1m', target: 100 },   // Ramp up to 100 users
    { duration: '2m', target: 500 },   // Ramp up to 500 users
    { duration: '1m', target: 100 },   // Ramp down
  ],
  thresholds: {
    // Built-in metrics
    'http_req_duration': ['p(95)<2000'],
    'http_req_failed': ['rate<0.1'],
    
    // Your custom metrics with thresholds
    'browse_product_time': ['p(95)<1500'],
    'critical_api_time': ['p(99)<5000'],
  },
};

// 3. MAIN TEST FUNCTION
export default function () {
  // SCENARIO 1: Browse products with custom timing
  let startTime = Date.now();
  let res = http.get('https://dummyjson.com/products?limit=10&skip=0');
  browseProductTime.add(Date.now() - startTime);  // Record to custom metric
  
  check(res, {
    'browse status 200': (r) => r.status === 200,
  });

  // SCENARIO 2: Get product detail with custom timing
  const productId = Math.floor(Math.random() * 100) + 1;
  startTime = Date.now();
  res = http.get(`https://dummyjson.com/products/${productId}`);
  getProductDetailTime.add(Date.now() - startTime);  // Record to custom metric
  
  check(res, {
    'detail status 200': (r) => r.status === 200,
  });

  // SCENARIO 3: Critical checkout path (custom timing)
  startTime = Date.now();
  const payload = JSON.stringify({
    items: [{ productId: productId, quantity: 1 }],
    userId: 1
  });
  
  const params = { 
    headers: { 
      'Content-Type': 'application/json',
      'Custom-Header': 'stress-test'
    } 
  };
  
  // This API might fail under stress - we track it specially
  res = http.post('https://dummyjson.com/carts/add', payload, params);
  criticalApiTime.add(Date.now() - startTime);  // Record to custom metric
  
  check(res, {
    'critical API responded': (r) => r.status > 0,
  });

  // Think time between iterations
  sleep(Math.random() * 1 + 0.5);
}