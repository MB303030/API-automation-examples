import defaultsPost from './postmanInfo.json' assert { type: 'json' };
import defaultsPut from './postmanInfoPut.json' assert { type: 'json' };

/**
 * Create POST /info payload with optional overrides.
 * - starts from defaultsPost and merges allowed nested/top-level overrides.
 */
export function createPostmanInfo(overrides = {}) {
  const result = { ...defaultsPost };

  if (overrides.user) result.user = { ...defaultsPost.user, ...overrides.user };
  if (overrides.contact) result.contact = { ...defaultsPost.contact, ...overrides.contact };

  const topLevelKeys = ['name', 'name2', 'active', 'timestamp'];
  for (const key of topLevelKeys) {
    if (key in overrides) result[key] = overrides[key];
  }

  return result;
}

/**
 * Create PUT /info payload with optional overrides.
 * - starts from defaultsPut and merges allowed nested/top-level overrides.
 */
export function createPostmanInfoPut(overrides = {}) {
  const result = { ...defaultsPut };

  if (overrides.user) result.user = { ...defaultsPut.user, ...overrides.user };
  if (overrides.contact) result.contact = { ...defaultsPut.contact, ...overrides.contact };

  const topLevelKeys = ['name', 'name2', 'active', 'timestamp'];
  for (const key of topLevelKeys) {
    if (key in overrides) result[key] = overrides[key];
  }

  return result;
}