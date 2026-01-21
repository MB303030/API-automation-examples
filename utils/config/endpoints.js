// utils/config/endpoints.js
import { getApiUrl } from './env.js';

/* ─────────────────────────────
   PET SERVICE ENDPOINTS
───────────────────────────── */
export function findByStatusEndpoint(status = 'available') {
  const safeStatus = encodeURIComponent(status);
  // Use 'petstore' or 'pet' (both are aliases in env.js)
  return getApiUrl('petstore', `/pet/findByStatus?status=${safeStatus}`);
}

export function storeInventoryEndpoint() {
  return getApiUrl('petstore', '/store/inventory');
}

/* ─────────────────────────────
   POSTMAN ECHO ENDPOINTS
───────────────────────────── */
export function postmanInfoEndpoint() {
  // Use 'postman' or 'echo' (both are aliases in env.js)
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

/* ─────────────────────────────
   GITHUB API ENDPOINTS (Example)
───────────────────────────── */
export function githubUserEndpoint(username) {
  return getApiUrl('github', `/users/${encodeURIComponent(username)}`);
}

export function githubReposEndpoint(username) {
  return getApiUrl('github', `/users/${encodeURIComponent(username)}/repos`);
}

/* ─────────────────────────────
   JSONPLACEHOLDER ENDPOINTS (Example)
───────────────────────────── */
export function jsonplaceholderPostsEndpoint() {
  return getApiUrl('jsonplaceholder', '/posts');
}

export function jsonplaceholderCommentsEndpoint() {
  return getApiUrl('jsonplaceholder', '/comments');
}

/* ─────────────────────────────
   REQRES ENDPOINTS (Example)
───────────────────────────── */
export function reqresUsersEndpoint() {
  return getApiUrl('reqres', '/users');
}

export function reqresLoginEndpoint() {
  return getApiUrl('reqres', '/login');
}

/* ─────────────────────────────
   HELPER FUNCTIONS
───────────────────────────── */

/**
 * Helper to build query string parameters
 * @param {Object} params - Key-value pairs for query parameters
 * @returns {string} Formatted query string
 */
export function buildQueryString(params) {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });
  
  return queryParams.toString();
}

/**
 * Create endpoint with query parameters
 * @param {string} baseEndpoint - Base endpoint URL
 * @param {Object} queryParams - Query parameters
 * @returns {string} Full URL with query string
 */
export function endpointWithParams(baseEndpoint, queryParams) {
  const queryString = buildQueryString(queryParams);
  return queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;
}

/**
 * Get products endpoint with custom query parameters
 * @param {Object} options - {limit, skip, select, sort, etc.}
 * @returns {string} Products URL with all parameters
 */
export function getProductsWithParams(options = {}) {
  const baseUrl = getApiUrl('dummyjson', '/products');
  return endpointWithParams(baseUrl, options);
}

/**
 * Get paginated endpoint
 * @param {string} endpoint - Base endpoint
 * @param {number} page - Page number (starting from 1)
 * @param {number} perPage - Items per page
 * @returns {string} Paginated URL
 */
export function getPaginatedEndpoint(endpoint, page = 1, perPage = 10) {
  const skip = (page - 1) * perPage;
  const limit = perPage;
  
  // Check if endpoint already has query params
  const separator = endpoint.includes('?') ? '&' : '?';
  return `${endpoint}${separator}skip=${skip}&limit=${limit}`;
}