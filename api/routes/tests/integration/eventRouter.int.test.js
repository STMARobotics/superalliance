// Bypass Clerk auth in tests
jest.mock('@clerk/express', () => ({
  requireAuth: () => (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../../../index');

process.env.TBA_KEY = process.env.TBA_KEY || 'test-key';

describe('eventRouter year validation (integration)', () => {
  test('returns 400 for non-numeric year on listEvents', async () => {
    const res = await request(app).get('/api/listEvents/1234/abcd');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid year');
  });

  test('returns 400 for year below 1990 on listEvents', async () => {
    const res = await request(app).get('/api/listEvents/1234/1989');
    expect(res.status).toBe(400);
  });

  test('returns 400 for year above current year + 1 on listEvents', async () => {
    const tooFarYear = new Date().getFullYear() + 2;
    const res = await request(app).get(`/api/listEvents/1234/${tooFarYear}`);
    expect(res.status).toBe(400);
  });
});
