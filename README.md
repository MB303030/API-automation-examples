
**To create it:**

```bash
# Save the minimal README
cat > README.md << 'EOF'
# API Testing Project

API automation framework using Playwright for functional testing and K6 for performance testing.

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Run all functional tests
npm test

# Run with UI mode
npm run test:ui

# View HTML report
npm run test:report
\`\`\`

## 📡 APIs Tested

- **PetStore API**: \`https://petstore.swagger.io/v2\`
- **Postman Echo API**: \`https://template.postman-echo.com\`
- **DummyJSON API**: \`https://dummyjson.com\`

## 📁 Project Structure

\`\`\`
tests/
├── api/              # Playwright functional tests
├── performance/      # K6 performance tests
└── fixtures/         # Test data

utils/
├── config/          # Environment & endpoints
└── core/            # Request helpers & headers
\`\`\`

## 🔧 Available Scripts

\`\`\`bash
npm test                    # Run all functional tests
npm run test:ui            # Run tests with UI mode
npm run test:report        # Show HTML report
npm run test:debug         # Run in debug mode
npm run test:dummyjson     # Run DummyJSON tests only
npm run test:postman       # Run Postman tests only
npm run test:petstore      # Run PetStore tests only
\`\`\`

## 🏃 CI/CD

Tests run automatically on GitHub Actions:
- Functional tests run on every push
- Performance tests run weekly on CI only

Check \`.github/workflows/\` for CI configuration.

## 📝 Notes

- Performance tests require Docker and run only on CI
- Environment variables can be set in \`.env\` file
- Test fixtures are stored in \`tests/fixtures/\`
