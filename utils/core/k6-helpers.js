/* ─────────────────────────────
   K6 PERFORMANCE TEST HELPERS
───────────────────────────── */

/**
 * Safely parse JSON response body
 * @param {Object} response - K6 HTTP response object
 * @returns {Object|null} Parsed body or null if parsing fails
 */
export function parseJsonBody(response) {
  try {
    return JSON.parse(response.body);
  } catch (e) {
    return null;
  }
}

/**
 * Check if response has valid JSON body
 * @param {Object} response - K6 HTTP response object
 * @returns {boolean}
 */
export function hasValidJsonBody(response) {
  return parseJsonBody(response) !== null;
}

/**
 * Check if response body has a specific property
 * @param {string} property - Property name to check
 * @returns {Function} Check function for K6
 */
export function hasProperty(property) {
  return (response) => {
    const body = parseJsonBody(response);
    return body !== null && property in body;
  };
}

/**
 * Check if response body has an array property with items
 * @param {string} property - Array property name
 * @returns {Function} Check function for K6
 */
export function hasArrayWithItems(property) {
  return (response) => {
    const body = parseJsonBody(response);
    return body !== null && Array.isArray(body[property]) && body[property].length > 0;
  };
}

/**
 * Check if response body has an array property (can be empty)
 * @param {string} property - Array property name
 * @returns {Function} Check function for K6
 */
export function hasArray(property) {
  return (response) => {
    const body = parseJsonBody(response);
    return body !== null && Array.isArray(body[property]);
  };
}

/**
 * Check if response body has all required fields
 * @param {string[]} fields - Array of required field names
 * @returns {Function} Check function for K6
 */
export function hasRequiredFields(fields) {
  return (response) => {
    const body = parseJsonBody(response);
    if (body === null) return false;
    return fields.every(field => field in body && body[field] !== undefined);
  };
}

/**
 * Check if response status is as expected
 * @param {number} expectedStatus - Expected HTTP status code
 * @returns {Function} Check function for K6
 */
export function hasStatus(expectedStatus) {
  return (response) => response.status === expectedStatus;
}

/**
 * Check if response time is under threshold
 * @param {number} maxDuration - Maximum duration in milliseconds
 * @returns {Function} Check function for K6
 */
export function responseUnder(maxDuration) {
  return (response) => response.timings.duration < maxDuration;
}

/**
 * Combine multiple checks into one
 * @param {Function[]} checks - Array of check functions
 * @returns {Function} Combined check function
 */
export function allOf(...checks) {
  return (response) => checks.every(check => check(response));
}

/**
 * Build checks object with common patterns
 * Note: K6's JS runtime doesn't support spread in object literals,
 * so this returns an object that should be used directly (not spread).
 * @param {Object} checksMap - Map of check name to check function
 * @returns {Object} K6 checks object
 */
export function buildChecks(checksMap) {
  return checksMap;
}

/**
 * Get random item from array
 * @param {Array} array - Array to pick from
 * @returns {*} Random item
 */
export function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Create weighted random selector
 * Usage: const scenario = weightedRandom({ browse: 60, detail: 25, search: 15 });
 * @param {Object} weights - Object with scenario names and their weights (should sum to 100)
 * @returns {string} Selected scenario name
 */
export function weightedRandom(weights) {
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (const [scenario, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (random < cumulative) {
      return scenario;
    }
  }
  
  // Fallback to first scenario
  return Object.keys(weights)[0];
}
