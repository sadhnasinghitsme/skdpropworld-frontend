const request = require('supertest');
const express = require('express');

// Create a test version of your app
const app = express();
app.use(express.json());

// Basic test route
app.get('/api', (req, res) => {
  res.send('✅ API is working fine!');
});

describe('API Tests', () => {
  test('GET /api should return success message', async () => {
    const response = await request(app)
      .get('/api')
      .expect(200);
    
    expect(response.text).toBe('✅ API is working fine!');
  });
});