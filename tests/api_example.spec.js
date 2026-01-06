import { test, expect } from '@playwright/test';
import findByStatusResponse from '../test-data/findByStatusResponse.json' assert { type: 'json' };
import { findByStatusEndpoint, storeInventoryEndpoint, apiGet } from '../utils/env.js';

test.describe('API verification example', () => {

  test('Verify GET /pet/findByStatus returns 200 and matches fixture structure', async ({ request }) => {
    
    // Build endpoint from environment helper (allows easy overrides)
    const endpoint = findByStatusEndpoint();
    const response = await apiGet(request, endpoint);

    // Expect a successful HTTP response
    expect(response.status()).toBe(200);

    // Parse response JSON into an array of pet objects
    const pets = await response.json();
    expect(Array.isArray(pets)).toBe(true);

    // Sanity-check: ensure the local fixture is an array as well
    expect(Array.isArray(findByStatusResponse)).toBe(true);

    // Select a name from the fixture to search for in the live response
    const fixtureName = findByStatusResponse[0]?.name;
    expect(typeof fixtureName).toBe('string');

    // Extract all valid pet `name` values from the live response
    const petNames = pets
      .map(p => p?.name)
      .filter(n => typeof n === 'string');

    // Also extract category names in case the fixture name appears there
    const categoryNames = pets
      .map(p => p?.category?.name)
      .filter(n => typeof n === 'string');

    // Combine and deduplicate names for a single containment check
    const allNames = Array.from(new Set([...petNames, ...categoryNames]));

    // Assert the fixture name exists somewhere in the live response (order-independent)
    expect(allNames).toContain(fixtureName);
  });

  test('GET /store/inventory with api key', async ({ request }) => {
    const endpoint = storeInventoryEndpoint();
    const response = await apiGet(request, endpoint);
    expect(response.status()).toBe(200);
    const inventory = await response.json();

    // Assert the returned JSON is not empty (works for arrays and objects)
    if (Array.isArray(inventory)) {
      expect(inventory.length).toBeGreaterThan(0);
    } else {
      expect(Object.keys(inventory).length).toBeGreaterThan(0);
    }
    
  });

});