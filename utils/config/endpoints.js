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

/* ─────────────────────────────
   DUMMYJSON ENDPOINTS - COMPLETE SET
───────────────────────────── */
export function getProductsEndpoint(limit = 30, skip = 0) {
  return getApiUrl('dummyjson', `/products?limit=${limit}&skip=${skip}`);
}

export function getProductByIdEndpoint(id) {
  return getApiUrl('dummyjson', `/products/${id}`);
}

export function searchProductsEndpoint(term) {
  return getApiUrl('dummyjson', `/products/search?q=${encodeURIComponent(term)}`);
}

export function getProductsByCategoryEndpoint(category) {
  return getApiUrl('dummyjson', `/products/category/${encodeURIComponent(category)}`);
}

export function getAllCategoriesEndpoint() {
  return getApiUrl('dummyjson', '/products/categories');
}

export function addNewProductEndpoint() {
  return getApiUrl('dummyjson', '/products/add');
}

export function updateProductEndpoint(id) {
  return getApiUrl('dummyjson', `/products/${id}`);
}