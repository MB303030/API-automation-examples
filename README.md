# Petstore API example (Playwright)

Simple beginner-friendly API test scaffold using Playwright's test runner and the public Petstore API.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Run tests:

```bash
npx playwright test tests/petstore.spec.js
```

Notes

- The base API URL can be overridden with the environment variable `API_BASE`.
- Tests use Playwright's `request` fixture so no extra HTTP library is required.

Files added

- `tests/env.js` — environment helpers
- `tests/requestManager.js` — simple request helpers
- `tests/petstore.spec.js` — example tests
