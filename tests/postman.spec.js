import { test, expect } from '@playwright/test'; // Playwright test runner + assertions
import {
  postmanInfoEndpoint,      // builds POST /info URL
  postmanInfoPutEndpoint,   // builds PUT /info?id=... URL
  postmanInfoDeleteEndpoint,// buildes DELTE /info?id=... URL
  apiPost,                  // helper to send JSON POST with default headers
  apiPut,                   // helper to send JSON PUT with default headers
  apiDelete                 //helper to send DELETE request with default headers
} from '../utils/env.js';
import { createPostmanInfo, createPostmanInfoPut } from '../post_requests/postmanInfo.js'; // payload factories


test.describe('Postman Echo /info API', () => {

  // POST test cases: title + overrides for createPostmanInfo
  const postCases = [
    { title: 'default', overrides: {} },
    { title: 'custom name/email', overrides: { name: 'Alice', contact: { email: 'alice@example.com' } } },
    { title: 'admin user', overrides: { user: { id: '99999', role: 'admin' } } }
  ];

  // Generate a test for each POST case
  for (const c of postCases) {
    test(`POST /info - ${c.title}`, async ({ request }) => {
      const endpoint = postmanInfoEndpoint();             // full POST URL
      const payload = createPostmanInfo(c.overrides);     // build request body with overrides

      const res = await apiPost(request, endpoint, payload); // send POST request
      expect(res.status()).toBe(200);                         // expect HTTP 200

      const body = await res.json();                          // parse response JSON
      const echoed = body?.json ?? body?.data ?? body;        // Postman Echo commonly uses `json` or `data`
      expect(echoed).toBeTruthy();                            // ensure response contains JSON

      // Top-level field assertions: match payload
      expect(echoed.name).toBe(payload.name);
      expect(echoed.name2).toBe(payload.name2);
      expect(echoed.active).toBe(payload.active);
      expect(echoed.timestamp).toBe(payload.timestamp);

      // user object assertions: ensure object exists and fields match
      expect(typeof echoed.user).toBe('object');
      expect(echoed.user.id).toBe(payload.user.id);
      expect(echoed.user.role).toBe(payload.user.role);
      expect(echoed.user.permissions).toEqual(payload.user.permissions); // array equality

      // contact object assertions: ensure object exists and fields match
      expect(typeof echoed.contact).toBe('object');
      expect(echoed.contact.email).toBe(payload.contact.email);
      expect(echoed.contact.phone).toBe(payload.contact.phone);
    });
  }

  // PUT test cases: title + overrides for createPostmanInfoPut
  const putCases = [
    { title: 'default put', overrides: {} },
    { title: 'update name fields', overrides: { name: 'Test User updated', name2: 'Secondary Name updated' } },
    { title: 'update user role', overrides: { user: { role: 'admin updated' } } }
  ];

  // Generate a test for each PUT case
  for (const c of putCases) {
    test(`PUT /info - ${c.title}`, async ({ request }) => {
      const endpoint = postmanInfoPutEndpoint(1);           // full PUT URL with id=1 query param
      const payload = createPostmanInfoPut(c.overrides);    // build PUT body with overrides

      const res = await apiPut(request, endpoint, payload); // send PUT request
      expect(res.status()).toBe(200);                       // expect HTTP 200

      const body = await res.json();                        // parse response JSON
      const echoed = body?.json ?? body?.data ?? body;      // find echoed payload
      expect(echoed).toBeTruthy();                          // ensure response contains JSON

      // Top-level field assertions for PUT
      expect(echoed.name).toBe(payload.name);
      expect(echoed.name2).toBe(payload.name2);
      expect(echoed.active).toBe(payload.active);
      expect(echoed.timestamp).toBe(payload.timestamp);

      // Nested user assertions
      expect(typeof echoed.user).toBe('object');
      expect(echoed.user.id).toBe(payload.user.id);
      expect(echoed.user.role).toBe(payload.user.role);
      expect(echoed.user.permissions).toEqual(payload.user.permissions);

      // Nested contact assertions
      expect(typeof echoed.contact).toBe('object');
      expect(echoed.contact.email).toBe(payload.contact.email);
      expect(echoed.contact.phone).toBe(payload.contact.phone);

      // If Postman Echo returns query args, verify id was echoed
      if (body?.args) expect(body.args.id).toBe('1');
    });
  }
   // Single DELETE test - no loop needed
  test('DELETE /info - delete resource', async ({ request }) => {
    const endpoint = postmanInfoDeleteEndpoint(12345);     // full DELETE URL with id=12345
    const res = await apiDelete(request, endpoint);       // send DELETE request
    expect(res.status()).toBe(200);                       // expect HTTP 200
    
    const body = await res.json();                        // parse response JSON
    
    // Verify the DELETE was processed
    expect(body).toBeTruthy();                            // ensure response is not empty
    
    // Postman Echo typically returns args with the query parameters
    if (body.args) {
      expect(body.args.id).toBe('12345');                 // verify the id parameter was echoed back
    }
    
    // Verify the method was DELETE
    if (body.method) {
      expect(body.method.toLowerCase()).toBe('delete');    // verify the request method
    }
  });

});