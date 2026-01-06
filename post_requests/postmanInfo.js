import defaultsFromJson from './postmanInfo.json' assert { type: 'json' };

// Use JSON file as defaults (keeps JS factory behavior unchanged)
const defaults = { ...defaultsFromJson };

export function createPostmanInfo(overrides = {}) {
  // Start from a shallow copy of the default payload so we don't mutate `defaults`.
  const result = { ...defaults };

  // Merge nested `user` object if overrides provide it.
  // This keeps default user fields (like permissions) unless the caller overrides them.
  if (overrides.user) result.user = { ...defaults.user, ...overrides.user };

  // Merge nested `contact` object if overrides provide it.
  // Keeps default contact fields unless overridden.
  if (overrides.contact) result.contact = { ...defaults.contact, ...overrides.contact };

  // List of top-level keys we allow simple overrides for.
  const topLevelKeys = ['name', 'name2', 'active', 'timestamp'];

  // For each allowed top-level key, if it exists in overrides, replace the default.
  for (const key of topLevelKeys) {
    if (key in overrides) result[key] = overrides[key];
  }

  // Return the final payload object; `defaults` remains unchanged.
  return result;
}