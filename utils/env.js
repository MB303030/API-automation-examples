/*
  Configuration and helpers for API endpoints.

  Use a map when you need multiple different base URLs.
  - baseUrls: named entries for services (pet, user, etc.). Each entry can be
    overridden with an env var (API_PET_BASE, API_USER_BASE).
  - baseUrl export kept for backward compatibility (defaults to pet service).
  - getApiUrl(service, path): use the named service's base URL.
    If callers pass a single argument (path), it defaults to the 'pet' service
    so existing call sites that passed just a path continue to work.
*/

// Map of service keys to their base URLs.
// - 'pet' is the default service for legacy callers.
// - Each entry can be overridden by an environment variable.
const baseUrls = {
  // Base URL used for pet-related endpoints; can be set with API_PET_BASE
  pet: process.env.API_PET_BASE || 'https://petstore.swagger.io/v2',
  // Base URL used for user-related endpoints; can be set with API_USER_BASE
  user: process.env.API_USER_BASE || 'https://user.service/v1',
  // New: Postman Echo service base (override with API_POSTMAN_BASE if needed)
  postman: process.env.API_POSTMAN_BASE || 'https://template.postman-echo.com'
};

// keep a simple default export for older code that expects baseUrl
// - This exposes the pet service base URL directly for backward compatibility.
export const baseUrl = baseUrls.pet;

/**
 * Build a full URL for an API path.
 * Usage:
 *  - getApiUrl('pet', '/pet/1')           // uses pet base URL
 *  - getApiUrl('/pet/1')                 // shorthand: defaults to 'pet' service
 */
export function getApiUrl(serviceOrPath, path) {
  // If only one argument provided, treat it as a path and use the default 'pet' base.
  if (path === undefined) {
    // serviceOrPath is actually the path in this case; prepend pet base URL.
    return `${baseUrls.pet}${serviceOrPath}`;
  }
  // Otherwise, serviceOrPath is a service key (e.g., 'pet' or 'user').
  const base = baseUrls[serviceOrPath];
  // Guard: throw if the caller provided an unknown service key.
  if (!base) throw new Error(`Unknown service "${serviceOrPath}"`);
  // Return the chosen base URL concatenated with the provided path.
  return `${base}${path}`;
}

/**
 * Helper to build the findByStatus endpoint for the pet service.
 * - status defaults to 'available'
 * - status is URL-encoded for safety
 * Example:
 *   findByStatusEndpoint('sold')
 *   => 'https://petstore.swagger.io/v2/pet/findByStatus?status=sold'
 */
export function findByStatusEndpoint(status = 'available') {
  // Encode the status to ensure characters like spaces or & are safe in the URL.
  const safeStatus = encodeURIComponent(status);
  // Use getApiUrl with the 'pet' service to build the full endpoint URL.
  return getApiUrl('pet', `/pet/findByStatus?status=${safeStatus}`);
}

/**
 * Helper to build the store inventory endpoint for the pet service.
 * Example:
 *   storeInventoryEndpoint()
 *   => 'https://petstore.swagger.io/v2/store/inventory'
 */
export function storeInventoryEndpoint() {
  // returns full URL for GET /store/inventory using the pet base URL
  return getApiUrl('pet', '/store/inventory');
}

// New: build full URL for Postman /info endpoint
export function postmanInfoEndpoint() {
  return getApiUrl('postman', '/info');
}

// Build PUT /info endpoint with optional id query parameter (defaults to id=1)
export function postmanInfoPutEndpoint(id = 1) {
  return getApiUrl('postman', `/info?id=${encodeURIComponent(id)}`);
}

/**
 * Default headers used across API tests.
 * - Pulls api_key from env to avoid hardcoding secrets.
 */
export function defaultApiHeaders() {
  return {
    Accept: 'application/json',
    api_key: process.env.API_KEY || 'your-default-api-key'
  };
}

// New: default JSON headers (used for POSTs)
export function defaultJsonHeaders() {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
}

/**
 * Lightweight helper that applies default headers and delegates to Playwright's request.
 * - request: the Playwright APIRequestContext passed into tests
 * - url: full endpoint string
 * - options: optional request options (method, headers, body, etc.)
 *   options.headers will override defaults when provided.
 */
export async function apiGet(request, url, options = {}) {
  const headers = { ...defaultApiHeaders(), ...(options.headers || {}) };
  return request.get(url, { ...options, headers });
}

// helper for POST requests that sends JSON body and merges headers
export async function apiPost(request, url, body = {}, options = {}) {
  const headers = { ...defaultJsonHeaders(), ...(options.headers || {}), ...defaultApiHeaders() };
  // Ensure Content-Type stays application/json and api_key / Accept are present
  // Playwright uses 'data' for raw body; stringify JSON
  return request.post(url, {
    data: JSON.stringify(body),
    headers,
    ...options
  });
}

// Helper to perform PUT requests with JSON body and default headers
export async function apiPut(request, url, body = {}, options = {}) {
  const headers = { ...defaultJsonHeaders(), ...(options.headers || {}), ...defaultApiHeaders() };
  return request.put(url, {
    data: JSON.stringify(body),
    headers,
    ...options
  });
}

// Build DELETE /info endpoint with optional id query parameter (defaults to id=12345)
export function postmanInfoDeleteEndpoint(id = 12345) {
  return getApiUrl('postman', `/info?id=${encodeURIComponent(id)}`);
}

// Add this after your existing apiPut function
// Helper to perform DELETE requests with default headers
export async function apiDelete(request, url, options = {}) {
  const headers = { ...defaultApiHeaders(), ...(options.headers || {}) };
  return request.delete(url, { headers, ...options });
}
