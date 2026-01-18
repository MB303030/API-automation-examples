// This is a K6 test because:
// 1. It imports from 'k6' package
import http from 'k6/http';
import { check } from 'k6';

// 2. It exports K6-specific options
export const options = {
  vus: 10,
  duration: '30s',
};

// 3. It uses K6's API functions
export default function () {
  const response = http.get('https://api.example.com');
  check(response, { 'status is 200': (r) => r.status === 200 });
}