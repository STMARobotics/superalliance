// Bypass Clerk auth in tests
jest.mock('@clerk/express', () => ({
  requireAuth: () => (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../../../index');

process.env.TBA_KEY = process.env.TBA_KEY || 'test-key';

describe('eventRouter param validation', () => {
  test('rejects invalid eventCode', async () => {
    const res = await request(app).get('/api/event/a$/match/1/data');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid eventCode');
  });

  test('rejects invalid matchNumber', async () => {
    const res = await request(app).get('/api/event/TEST/match/0/data');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid matchNumber');
  });

  test('rejects invalid teamNumber', async () => {
    const res = await request(app).get('/api/event/TEST/team/0/rank');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid teamNumber');
  });

  test('rejects invalid team param on listEvents', async () => {
    const res = await request(app).get(`/api/listEvents/0/${new Date().getFullYear()}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid team');
  });
});
