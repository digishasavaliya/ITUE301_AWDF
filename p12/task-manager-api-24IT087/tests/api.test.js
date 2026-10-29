jest.mock('mongoose', () => {
  const mongoose = jest.requireActual('mongoose');
  return {
    ...mongoose,
    connection: { readyState: 0 },
    connect: jest.fn().mockResolvedValue(mongoose),
  };
});

const request = require('supertest');
const app = require('../server');

describe('Task Manager API', () => {
  test('GET / returns the API welcome message and endpoint map', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task Manager API is running');
    expect(response.body.endpoints.tasks).toBe('/tasks');
  });

  test('GET /tasks rejects requests without a bearer token', async () => {
    const response = await request(app).get('/tasks');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Authentication token required' });
  });
});
