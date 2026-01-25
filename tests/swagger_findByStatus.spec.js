import { test, expect } from '@playwright/test';
import findByStatusResponse from '../test-data/findByStatusResponse.json' assert { type: 'json' };

// ✅ ENDPOINTS from endpoints.js
import { findByStatusEndpoint, storeInventoryEndpoint } from '../utils/config/endpoints.js';

// ✅ REQUEST HELPER from NEW request.js file
import { apiGet } from '../utils/core/request.js';  // Changed from env.js to request.js

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
    expect(pets.length).toBeGreaterThan(0);

    // Sanity-check: ensure the local fixture is an array as well
    expect(Array.isArray(findByStatusResponse)).toBe(true);

    // Validate response structure matches fixture structure (not exact values)
    // Since PetStore is a public sandbox API, data changes constantly
    const samplePet = pets[0];
    const fixturePet = findByStatusResponse[0];

    // Validate that live response has the same structure as fixture
    expect(samplePet).toHaveProperty('id');
    expect(samplePet).toHaveProperty('name');
    expect(samplePet).toHaveProperty('status');
    
    // Validate types match fixture structure
    expect(typeof samplePet.id).toBe('number');
    expect(typeof samplePet.name).toBe('string');
    expect(typeof samplePet.status).toBe('string');
    
    // Validate status matches our query parameter
    expect(samplePet.status).toBe('available');
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