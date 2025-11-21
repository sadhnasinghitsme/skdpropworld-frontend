# API Testing Guide

## Quick Start

### 1. Start the Server
```bash
cd server
npm install
npm run dev
```

The server will start on port 8080 (or the port specified in your .env file).

### 2. Test Basic API
```bash
curl http://localhost:8080/api
```
Expected response: `✅ API is working fine!`

## Available Endpoints

### Projects API

#### Get All Projects
```bash
curl http://localhost:8080/api/admin/projects
```

#### Get Project by Slug
```bash
curl http://localhost:8080/api/admin/projects/slug/your-project-slug
```

#### Get SKD Picks
```bash
curl http://localhost:8080/api/admin/projects/top-picks
```

#### Search Projects
```bash
curl "http://localhost:8080/api/admin/projects/search?query=luxury"
```

#### Create New Project (POST)
```bash
curl -X POST http://localhost:8080/api/admin/projects \
  -H "Content-Type: application/json" \
  -d '{
    "heading": "Test Project",
    "location": "Test Location",
    "propertyType": "Apartment",
    "visible": true
  }'
```

## Automated Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Test Coverage
```bash
npm test -- --coverage
```

## Testing Tools

### 1. Postman
- Download from https://www.postman.com/
- Import your API endpoints
- Create collections for different endpoint groups
- Test different HTTP methods and data

### 2. Thunder Client (VS Code Extension)
- Install from VS Code marketplace
- Built-in API testing tool
- Lightweight alternative to Postman

### 3. cURL (Command Line)
- Available on most systems
- Quick testing from terminal
- Good for automation scripts

## Common Test Scenarios

### 1. Success Cases
- Valid data submission
- Correct response formats
- Expected status codes (200, 201, etc.)

### 2. Error Cases
- Invalid data formats
- Missing required fields
- Non-existent resources (404)
- Server errors (500)

### 3. Edge Cases
- Empty requests
- Very large data
- Special characters
- Boundary values

## Environment Variables

Make sure your `.env` file contains:
```
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=8080
```

## Troubleshooting

### Server Won't Start
1. Check if MongoDB is running
2. Verify environment variables
3. Install missing dependencies: `npm install`

### Tests Failing
1. Ensure server is not running during tests
2. Check test database connection
3. Clear Jest cache: `npx jest --clearCache`

### API Returns Errors
1. Check request format (JSON headers)
2. Verify required fields
3. Check server logs for detailed errors

## Best Practices

1. **Test Early and Often**: Run tests after each change
2. **Use Descriptive Names**: Make test names clear and specific
3. **Test Both Success and Failure**: Cover happy path and error cases
4. **Mock External Services**: Don't rely on external APIs in tests
5. **Keep Tests Independent**: Each test should work in isolation
6. **Use Test Data**: Create specific test datasets
7. **Clean Up**: Reset state between tests

## Next Steps

1. Add more comprehensive test coverage
2. Set up continuous integration (CI)
3. Add performance testing
4. Implement API documentation (Swagger)
5. Add authentication testing
6. Set up monitoring and logging