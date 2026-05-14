jest.mock('@clerk/express', () => ({
  requireAuth: () => (req, res, next) => next(),
  getAuth: () => ({
    sessionClaims: { data: { role: 'admin' } },
    userId: 'test-user',
  }),
}));

jest.mock('../../../models/TeamSelectionSchema', () => ({
  findOne: jest.fn(),
}));

const request = require('supertest');
const app = require('../../../index');
const TeamSelectionSchema = require('../../../models/TeamSelectionSchema');

describe('teamSelectionRouter report export (integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns utf-8 csv with bom for excel compatibility', async () => {
    TeamSelectionSchema.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue({
        teams: [
          { columnId: 'r1', teamNumber: 111, teamName: 'Alpha -△◅' },
          { columnId: 'r2', teamNumber: 222, teamName: 'Bravo' },
        ],
      }),
    });

    const res = await request(app).get('/api/teamSelection/2026/TEST/report');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv; charset=utf-8');
    expect(res.text.charCodeAt(0)).toBe(0xfeff);
    expect(res.text).toContain('111 - Alpha -△◅');
  });
});