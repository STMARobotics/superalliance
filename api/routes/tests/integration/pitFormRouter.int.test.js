// Bypass Clerk auth in tests
jest.mock('@clerk/express', () => ({
  requireAuth: () => (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../../../index');

process.env.TBA_KEY = process.env.TBA_KEY || 'test-key';
process.env.AWS_REGION = process.env.AWS_REGION || 'us-east-1';
process.env.ROBOT_IMAGE_BUCKET = process.env.ROBOT_IMAGE_BUCKET || 'test-bucket';

describe('pitFormRouter year validation (integration)', () => {
  test('returns 400 for missing year in image upload', async () => {
    const res = await request(app)
      .post('/api/form/pit/image-upload')
      .send({ teamNumber: '1234', eventCode: 'TEST', fileType: 'image/png' });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid image upload body');
  });

  test('returns 400 for non-numeric year in image upload', async () => {
    const res = await request(app)
      .post('/api/form/pit/image-upload')
      .send({ year: 'abc', teamNumber: '1234', eventCode: 'TEST', fileType: 'image/png' });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid image upload body');
  });

  test('returns 400 for year below 1990 in image upload', async () => {
    const res = await request(app)
      .post('/api/form/pit/image-upload')
      .send({ year: 1989, teamNumber: '1234', eventCode: 'TEST', fileType: 'image/png' });
    
    expect(res.status).toBe(400);
  });

  test('returns 400 for year above current year + 1 in image upload', async () => {
    const tooFarYear = new Date().getFullYear() + 2;
    const res = await request(app)
      .post('/api/form/pit/image-upload')
      .send({ year: tooFarYear, teamNumber: '1234', eventCode: 'TEST', fileType: 'image/png' });
    
    expect(res.status).toBe(400);
  });
});

describe('pitFormRouter body validation (integration)', () => {
  test('returns 400 for invalid eventCode in image upload body', async () => {
    const res = await request(app)
      .post('/api/form/pit/image-upload')
      .send({ year: 2025, teamNumber: '1234', eventCode: '!@', fileType: 'image/png' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid image upload body');
  });

  test('returns 400 for invalid teamNumber in image upload body', async () => {
    const res = await request(app)
      .post('/api/form/pit/image-upload')
      .send({ year: 2025, teamNumber: 0, eventCode: 'TEST', fileType: 'image/png' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid image upload body');
  });

  test('returns 400 for missing fileType in image upload body', async () => {
    const res = await request(app)
      .post('/api/form/pit/image-upload')
      .send({ year: 2025, teamNumber: 1234, eventCode: 'TEST' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid image upload body');
  });

  test('returns 400 for unsupported fileType in image upload body', async () => {
    const res = await request(app)
      .post('/api/form/pit/image-upload')
      .send({ year: 2025, teamNumber: 1234, eventCode: 'TEST', fileType: 'text/plain' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid image upload body');
  });
});

describe('pitFormRouter body validation (integration)', () => {
  test('returns 400 for invalid eventCode in image upload body', async () => {
    const res = await request(app)
      .post('/api/form/pit/image-upload')
      .send({ year: 2025, eventCode: '!@', teamNumber: 1234, fileType: 'image/png' });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid image upload body');
  });

  test('returns 400 for invalid teamNumber in image upload body', async () => {
    const res = await request(app)
      .post('/api/form/pit/image-upload')
      .send({ year: 2025, eventCode: 'TEST', teamNumber: 0, fileType: 'image/png' });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid image upload body');
  });
});
