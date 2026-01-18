import { test, expect } from '@playwright/test';

// ✅ ENDPOINTS from endpoints.js
import {
  postmanInfoEndpoint,
  postmanInfoPutEndpoint,
  postmanInfoDeleteEndpoint
} from '../utils/endpoints.js';

// ✅ REQUEST HELPERS from request.js
import {
  apiPost,
  apiPut,
  apiDelete
} from '../utils/request.js';

// ✅ PAYLOAD FACTORIES
import { createPostmanInfo, createPostmanInfoPut } from '../post_requests/postmanInfo.js';

test.describe('Postman Echo /info API', () => {

  // ─────────────────────────────────────
  // POST TEST CASES
  // ─────────────────────────────────────
  const postCases = [
    { title: 'default', overrides: {} },
    { title: 'custom name/email', overrides: { name: 'Alice', contact: { email: 'alice@example.com' } } },
    { title: 'admin user', overrides: { user: { id: '99999', role: 'admin' } } }
  ];

  for (const c of postCases) {
    test(`POST /info - ${c.title}`, async ({ request }) => {
      const endpoint = postmanInfoEndpoint();
      const payload = createPostmanInfo(c.overrides);

      // Send POST request using our helper
      const res = await apiPost(request, endpoint, payload);

      expect(res.status()).toBe(200);

      const body = await res.json();
      const echoed = body?.json ?? body?.data ?? body;
      expect(echoed).toBeTruthy();

      // Basic assertions
      expect(echoed.name).toBe(payload.name);
      expect(echoed.name2).toBe(payload.name2);
      expect(echoed.active).toBe(payload.active);
      expect(echoed.timestamp).toBe(payload.timestamp);

      // User object assertions
      expect(echoed.user.id).toBe(payload.user.id);
      expect(echoed.user.role).toBe(payload.user.role);
      expect(echoed.user.permissions).toEqual(payload.user.permissions);

      // Contact object assertions
      expect(echoed.contact.email).toBe(payload.contact.email);
      expect(echoed.contact.phone).toBe(payload.contact.phone);
    });
  }

  // ─────────────────────────────────────
  // PUT TEST CASES
  // ─────────────────────────────────────
  const putCases = [
    { title: 'default put', overrides: {} },
    { title: 'update name fields', overrides: { name: 'Updated', name2: 'Updated 2' } },
    { title: 'update user role', overrides: { user: { role: 'admin updated' } } }
  ];

  for (const c of putCases) {
    test(`PUT /info - ${c.title}`, async ({ request }) => {
      const endpoint = postmanInfoPutEndpoint(1);
      const payload = createPostmanInfoPut(c.overrides);

      // Send PUT request using our helper
      const res = await apiPut(request, endpoint, payload);

      expect(res.status()).toBe(200);

      const body = await res.json();
      const echoed = body?.json ?? body?.data ?? body;

      expect(echoed.name).toBe(payload.name);
      expect(echoed.name2).toBe(payload.name2);
      expect(echoed.active).toBe(payload.active);
      expect(echoed.timestamp).toBe(payload.timestamp);
    });
  }

  // ─────────────────────────────────────
  // DELETE TEST
  // ─────────────────────────────────────
  test('DELETE /info', async ({ request }) => {
    const endpoint = postmanInfoDeleteEndpoint(12345);

    // Send DELETE request using our helper
    const res = await apiDelete(request, endpoint);

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toBeTruthy();

    if (body.args) {
      expect(body.args.id).toBe('12345');
    }

    if (body.method) {
      expect(body.method.toLowerCase()).toBe('delete');
    }
  });

});