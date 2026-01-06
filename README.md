# API Testing with Playwright

Simple API testing framework using Playwright to demonstrate automation skills across multiple public APIs.

## 📦 Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

RUN TEST:
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/petstore.spec.js

# Run with UI mode
npx playwright test --ui

# Run with report
npx playwright test --reporter=html

APIs Tested
1. Petstore API (Swagger)
Base URL: https://petstore.swagger.io/v2

Endpoints:

GET /pet/findByStatus - Find pets by status

GET /store/inventory - Get store inventory

Authentication: API key in header

2. Postman Echo API
Base URL: https://template.postman-echo.com

Endpoints:

POST /info - Create resource

PUT /info?id=:id - Update resource

DELETE /info?id=:id - Delete resource

Features: Echoes back request data for validation

3. DummyJSON API
Base URL: https://dummyjson.com

Endpoints:

GET /products/:id - Get product details

POST /products/add - Create product

PUT /products/:id - Update product

DELETE /products/:id - Delete product

POST /auth/login - User authentication

Configuration
Environment variables can be set in .env file:

env
API_PET_BASE=https://petstore.swagger.io/v2
API_POSTMAN_BASE=https://template.postman-echo.com
API_KEY=your-api-key-here