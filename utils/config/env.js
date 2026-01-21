// utils/config/env.js
// CLEAN CONFIGURATION FILE - NO REDUNDANCIES

/**
 * Base URL configuration for all services
 * Add all your project APIs here
 */
const baseUrls = {
  // E-commerce & Products
  dummyjson: 'https://dummyjson.com',
  
  // Pet Store (Swagger example)
  petstore: 'https://petstore.swagger.io/v2',
  pet: 'https://petstore.swagger.io/v2', // alias
  
  // Postman Echo (for testing)
  postman: 'https://postman-echo.com',
  echo: 'https://postman-echo.com', // alias
  
  // GitHub API
  github: 'https://api.github.com',
  
  // JSONPlaceholder (testing API)
  jsonplaceholder: 'https://jsonplaceholder.typicode.com',
  
  // ReqRes (testing API)
  reqres: 'https://reqres.in/api',
  
  // Local development
  local: 'http://localhost:3000',
  
  // Add more services as needed for your projects...
};

/**
 * Get full API URL for a service
 * @param {string} service - Service name from baseUrls
 * @param {string} path - API endpoint path
 * @returns {string} Full URL
 */
export function getApiUrl(service, path) {
  const baseUrl = baseUrls[service] || baseUrls.dummyjson;
  
  // Ensure path starts with slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Get base URL only (without path)
 * @param {string} service - Service name
 * @returns {string} Base URL
 */
export function getBaseUrl(service) {
  return baseUrls[service] || baseUrls.dummyjson;
}

/**
 * Helper: Get service names available
 * @returns {string[]} List of service names
 */
export function getAvailableServices() {
  return Object.keys(baseUrls);
}

/**
 * Helper: Check if service exists
 * @param {string} service - Service name to check
 * @returns {boolean} True if service exists
 */
export function hasService(service) {
  return service in baseUrls;
}