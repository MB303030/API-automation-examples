import { test, expect } from '@playwright/test'; // Playwright test runner & assertions
import { postmanInfoEndpoint, apiPost } from '../utils/env.js'; // helpers: endpoint builder + POST wrapper
import { createPostmanInfo } from '../post_requests/postmanInfo.js'; // payload factory to produce request bodies

// Array of test cases with a title and overrides to parametrize the request body
const cases = [
  { title: 'default', overrides: {} },
  { title: 'custom name/email', overrides: { name: 'Alice', contact: { email: 'alice@example.com' } } },
  { title: 'admin user', overrides: { user: { id: '99999', role: 'admin' } } }
];

// Loop over cases and create a separate Playwright test for each entry
for (const c of cases) {
  // Create a named test using the case title
  test(`POST /info - ${c.title}`, async ({ request }) => {
    const endpoint = postmanInfoEndpoint(); // build full URL for POST /info
    const payload = createPostmanInfo(c.overrides); // produce the request body with overrides applied

    const res = await apiPost(request, endpoint, payload); // send POST using shared helper (adds headers, stringifies)
    expect(res.status()).toBe(200); // assert HTTP 200

    const body = await res.json(); // parse JSON response
    // Postman Echo wraps the echoed payload; try common wrapper keys then fallback to top-level
    const echoed = body?.json ?? body?.data ?? body;

    expect(echoed).toBeTruthy(); // response must contain some JSON

    // Assert all top-level primitive fields
    expect(echoed.name).toBe(payload.name);
    expect(echoed.name2).toBe(payload.name2);
    expect(echoed.active).toBe(payload.active);
    expect(echoed.timestamp).toBe(payload.timestamp);

    // Assert `user` object fields
    expect(typeof echoed.user).toBe('object');
    expect(echoed.user.id).toBe(payload.user.id);
    expect(echoed.user.role).toBe(payload.user.role);
    expect(echoed.user.permissions).toEqual(payload.user.permissions); // array equality

    // Assert `contact` object fields
    expect(typeof echoed.contact).toBe('object');
    expect(echoed.contact.email).toBe(payload.contact.email);
    expect(echoed.contact.phone).toBe(payload.contact.phone);

    // add further assertions here for additional fields if needed
  });
}