jest.mock('@clerk/express', () => ({
  requireAuth: () => (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../../../index');

process.env.TBA_KEY = process.env.TBA_KEY || 'test-key';

describe('aggregationRouter param validation', () => {
  test('rejects invalid eventId on aggregation', async () => {
    const res = await request(app).get('/api/aggregation/event/ab$');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid eventId');
  });
});
