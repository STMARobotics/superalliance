jest.mock('@clerk/express', () => ({
  requireAuth: () => (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../../../index');

process.env.TBA_KEY = process.env.TBA_KEY || 'test-key';

describe('formRouter param validation', () => {
  test('rejects invalid formId on stand form', async () => {
    const res = await request(app).get('/api/form/stand/nothex');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid formId');
  });
});
