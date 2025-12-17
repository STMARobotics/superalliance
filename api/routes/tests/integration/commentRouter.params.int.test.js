jest.mock('@clerk/express', () => ({
  requireAuth: () => (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../../../index');

process.env.TBA_KEY = process.env.TBA_KEY || 'test-key';

describe('commentRouter param validation', () => {
  test('rejects invalid formId on comments', async () => {
    const res = await request(app).get('/api/form/comments/nothex');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid formId');
  });
});

describe('commentRouter body validation', () => {
  test('rejects invalid event in body', async () => {
    const res = await request(app)
      .post('/api/form/comments/submit')
      .send({ event: '!@', teamNumber: 1234, comments: 'hi' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid comment submission');
  });

  test('rejects invalid teamNumber in body', async () => {
    const res = await request(app)
      .post('/api/form/comments/submit')
      .send({ event: 'TEST', teamNumber: 0, comments: 'hi' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid comment submission');
  });
});
