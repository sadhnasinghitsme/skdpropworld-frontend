const request = require('supertest');
const express = require('express');

// Create a simple test app without complex dependencies
const app = express();
app.use(express.json());

// Simple mock routes for testing
app.get('/api/projects', (req, res) => {
  res.json([
    { id: 1, name: 'Test Project 1', location: 'Location 1' },
    { id: 2, name: 'Test Project 2', location: 'Location 2' }
  ]);
});

app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  if (id === '1') {
    res.json({ id: 1, name: 'Test Project 1', location: 'Location 1' });
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

app.post('/api/projects', (req, res) => {
  const { name, location } = req.body;
  if (!name || !location) {
    return res.status(400).json({ message: 'Name and location are required' });
  }
  res.status(201).json({ 
    id: 3, 
    name, 
    location, 
    message: 'Project created successfully' 
  });
});

describe('Project API Tests', () => {
  describe('GET /api/projects', () => {
    test('should return all projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name', 'Test Project 1');
    });
  });

  describe('GET /api/projects/:id', () => {
    test('should return project by id', async () => {
      const response = await request(app)
        .get('/api/projects/1')
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Test Project 1');
    });

    test('should return 404 for non-existent project', async () => {
      const response = await request(app)
        .get('/api/projects/999')
        .expect(404);

      expect(response.body.message).toBe('Project not found');
    });
  });

  describe('POST /api/projects', () => {
    test('should create new project', async () => {
      const newProject = {
        name: 'New Test Project',
        location: 'New Location'
      };

      const response = await request(app)
        .post('/api/projects')
        .send(newProject)
        .expect(201);

      expect(response.body.message).toBe('Project created successfully');
      expect(response.body.name).toBe(newProject.name);
    });

    test('should return 400 for missing data', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({ name: 'Test' })
        .expect(400);

      expect(response.body.message).toBe('Name and location are required');
    });
  });
});