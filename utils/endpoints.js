import { getApiUrl } from './env.js';

/* ─────────────────────────────
   PET SERVICE ENDPOINTS
───────────────────────────── */

export function findByStatusEndpoint(status = 'available') {
  const safeStatus = encodeURIComponent(status);
  return getApiUrl('pet', `/pet/findByStatus?status=${safeStatus}`);
}

export function storeInventoryEndpoint() {
  return getApiUrl('pet', '/store/inventory');
}

/* ─────────────────────────────
   POSTMAN ECHO ENDPOINTS
───────────────────────────── */

export function postmanInfoEndpoint() {
  return getApiUrl('postman', '/info');
}

export function postmanInfoPutEndpoint(id = 1) {
  return getApiUrl('postman', `/info?id=${encodeURIComponent(id)}`);
}

export function postmanInfoDeleteEndpoint(id = 12345) {
  return getApiUrl('postman', `/info?id=${encodeURIComponent(id)}`);
}