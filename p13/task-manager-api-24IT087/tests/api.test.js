jest.mock('mongoose', () => {
  const mongoose = jest.requireActual('mongoose');
  return {
    ...mongoose,
    connection: { readyState: 0 },
    connect: jest.fn().mockResolvedValue(mongoose),
  };
});

const mockCreateCompletion = jest.fn().mockResolvedValue({
  choices: [{ message: { content: 'Review concepts and practise representative coding questions.' } }],
});

jest.mock('groq-sdk', () => jest.fn(() => ({
  chat: { completions: { create: mockCreateCompletion } },
})));

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

  test('POST /api/ai/generate-description returns parsed Groq text', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'test-user' }, process.env.JWT_SECRET);
    const response = await request(app)
      .post('/api/ai/generate-description')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: `Prepare interview ${Date.now()}` });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      description: 'Review concepts and practise representative coding questions.',
      fallback: false,
    });
  });

  test('POST /api/ai/generate-description rejects an empty title', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'test-user' }, process.env.JWT_SECRET);
    const response = await request(app)
      .post('/api/ai/generate-description')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '   ' });

    expect(response.status).toBe(400);
  });

  test('AI generation is rate limited per normalized title', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'test-user' }, process.env.JWT_SECRET);
    const title = `Rate limited ${Date.now()}`;
    const headers = { Authorization: `Bearer ${token}` };
    await request(app).post('/api/ai/generate-description').set(headers).send({ title });
    const response = await request(app).post('/api/ai/generate-description').set(headers).send({ title: `  ${title.toUpperCase()} ` });

    expect(response.status).toBe(429);
  });

  test('Groq failure returns a graceful fallback response', async () => {
    mockCreateCompletion.mockRejectedValueOnce(new Error('provider unavailable'));
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'test-user' }, process.env.JWT_SECRET);
    const response = await request(app)
      .post('/api/ai/generate-description')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: `Provider failure ${Date.now()}` });

    expect(response.status).toBe(503);
    expect(response.body.fallback).toBe(true);
    expect(response.body.description).toBeTruthy();
  });
});
