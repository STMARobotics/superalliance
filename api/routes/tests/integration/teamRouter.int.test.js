// Bypass Clerk auth in tests
jest.mock('@clerk/express', () => ({
  requireAuth: () => (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../../../index');

process.env.TBA_KEY = process.env.TBA_KEY || 'test-key';

describe('teamRouter year validation (integration)', () => {
  test('returns 400 for non-numeric year', async () => {
    const res = await request(app).get('/api/teams/abcd/TEST');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid year');
  });

  test('returns 400 for year below 1990', async () => {
    const res = await request(app).get('/api/teams/1989/TEST');
    expect(res.status).toBe(400);
  });

  test('returns 400 for year above current year + 1', async () => {
    const tooFarYear = new Date().getFullYear() + 2;
    const res = await request(app).get(`/api/teams/${tooFarYear}/TEST`);
    expect(res.status).toBe(400);
  });
});
