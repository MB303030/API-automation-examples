import { test, expect } from '@playwright/test';

// Import the endpoint function
import { getProductsEndpoint } from '../../utils/config/endpoints.js';

// Import our existing helper
import { apiGet } from '../../utils/core/request.js';

import productsFixture from '../../fixtures/dummyjson/products_paginated.json' assert { type: 'json' };

test.describe('DummyJSON Products API', () => {

  test('GET /products with pagination - should match fixture structure', async ({ request }) => {
    // Use the same parameters as in the fixture: limit=5, skip=10
    const endpoint = getProductsEndpoint(5, 10);
    
    const response = await apiGet(request, endpoint);
    
    // Basic HTTP assertions
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    
    const actualResponse = await response.json();
    
    // ✅ 1. Validate top-level structure matches fixture
    expect(actualResponse).toHaveProperty('products');
    expect(actualResponse).toHaveProperty('total');
    expect(actualResponse).toHaveProperty('skip');
    expect(actualResponse).toHaveProperty('limit');
    
    // ✅ 2. Compare pagination values with fixture
    expect(actualResponse.limit).toBe(productsFixture.limit);  // Should be 5
    expect(actualResponse.skip).toBe(productsFixture.skip);    // Should be 10
    
    // ✅ 3. Validate products array structure
    const actualProducts = actualResponse.products;
    expect(Array.isArray(actualProducts)).toBe(true);
    expect(actualProducts.length).toBe(productsFixture.limit); // Should have 5 products
    
    // ✅ 4. Validate first product matches fixture structure
    if (actualProducts.length > 0) {
      const actualProduct = actualProducts[0];
      const fixtureProduct = productsFixture.products[0];
      
      // Check all properties from fixture exist in actual response
      Object.keys(fixtureProduct).forEach(key => {
        expect(actualProduct).toHaveProperty(key);
      });
      
      // Check specific important fields
      expect(typeof actualProduct.id).toBe('number');
      expect(typeof actualProduct.title).toBe('string');
      expect(typeof actualProduct.price).toBe('number');
      expect(typeof actualProduct.category).toBe('string');
      
      // Optional: Compare specific values if they should match
      // Note: Actual IDs/titles might differ from fixture since it's a live API
      // But structure should be the same
    }
  });

  // ✅ Optional: Test to validate fixture itself
  test('Fixture should have valid structure', () => {
    // Validate the fixture file is correctly formatted
    expect(productsFixture).toHaveProperty('products');
    expect(productsFixture).toHaveProperty('total');
    expect(productsFixture).toHaveProperty('skip', 10);
    expect(productsFixture).toHaveProperty('limit', 5);
    
    expect(Array.isArray(productsFixture.products)).toBe(true);
    
    if (productsFixture.products.length > 0) {
      const product = productsFixture.products[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
    }
  });

});