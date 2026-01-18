// Map of service keys to their base URLs.
const baseUrls = {
  pet: process.env.API_PET_BASE || 'https://petstore.swagger.io/v2',
  user: process.env.API_USER_BASE || 'https://user.service/v1',
  postman: process.env.API_POSTMAN_BASE || 'https://template.postman-echo.com',
  dummyjson: process.env.API_DUMMYJSON_BASE || 'https://dummyjson.com'
};

// Backward compatibility
export const baseUrl = baseUrls.pet;

export function getApiUrl(serviceOrPath, path) {
  if (path === undefined) {
    return `${baseUrls.pet}${serviceOrPath}`;
  }

  const base = baseUrls[serviceOrPath];
  if (!base) {
    throw new Error(`Unknown service "${serviceOrPath}"`);
  }

  return `${base}${path}`;
}