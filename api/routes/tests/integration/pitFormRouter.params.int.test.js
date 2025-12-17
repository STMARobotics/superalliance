jest.mock('@clerk/express', () => ({
  requireAuth: () => (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../../../index');

process.env.TBA_KEY = process.env.TBA_KEY || 'test-key';
process.env.AWS_REGION = process.env.AWS_REGION || 'us-east-1';
process.env.ROBOT_IMAGE_BUCKET = process.env.ROBOT_IMAGE_BUCKET || 'test-bucket';

describe('pitFormRouter param validation', () => {
  test('rejects invalid eventCode on pit form get', async () => {
    const res = await request(app).get('/api/form/pit/!@/123');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid eventCode');
  });

  test('rejects invalid teamNumber on pit form get', async () => {
    const res = await request(app).get('/api/form/pit/TEST/0');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid teamNumber');
  });
});
