const mockBedrockSend = jest.fn();
const mockAggregate = jest.fn();
const mockSettingsFindOne = jest.fn();
const mockAggregateOption = jest.fn();
const mockAggregateExec = jest.fn();

jest.mock('@clerk/express', () => ({
  clerkMiddleware: () => (req, res, next) => next(),
  getAuth: (req) => ({
    userId: req.headers['x-test-unauthenticated'] ? null : 'test-user',
    sessionClaims: { public_metadata: { role: req.headers['x-test-role'] || 'admin' } },
  }),
}));
jest.mock('@aws-sdk/client-bedrock-runtime', () => ({
  BedrockRuntimeClient: jest.fn(() => ({ send: mockBedrockSend })),
  InvokeModelCommand: jest.fn((input) => input),
}));
jest.mock('../../../models/SuperAllianceConfig', () => ({ findOne: mockSettingsFindOne }));

const request = require('supertest');
const StandFormSchema = require('../../../models/StandFormSchema');
jest.spyOn(StandFormSchema, 'aggregate').mockImplementation((pipeline) => {
  mockAggregate(pipeline);
  return {
    option(options) {
      mockAggregateOption(options);
      return this;
    },
    exec: mockAggregateExec,
  };
});
const app = require('../../../index');

function bedrockTextResponse(text) {
  return {
    body: new TextEncoder().encode(JSON.stringify({
      output: { message: { content: [{ text }] } },
    })),
  };
}

beforeEach(() => {
  mockBedrockSend.mockReset();
  mockAggregate.mockReset();
  mockAggregateOption.mockReset();
  mockAggregateExec.mockReset().mockResolvedValue([{ teamNumber: 1 }]);
  mockSettingsFindOne.mockReset().mockReturnValue({
    lean: jest.fn().mockResolvedValue({ event: 'TEST_EVENT' }),
  });
});

describe('AI scouting query validation', () => {
  test('rejects unauthenticated requests', async () => {
    const response = await request(app)
      .post('/api/ai/query')
      .set('x-test-unauthenticated', 'true')
      .send({ userPrompt: 'Which teams have never climbed?' });

    expect(response.status).toBe(401);
  });

  test('rejects authenticated non-admin requests', async () => {
    const response = await request(app)
      .post('/api/ai/query')
      .set('x-test-role', 'scout')
      .send({ userPrompt: 'Which teams have never climbed?' });

    expect(response.status).toBe(403);
  });

  test('rejects an empty prompt before contacting AWS or MongoDB', async () => {
    const response = await request(app).post('/api/ai/query').send({ userPrompt: '  ' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('rejects a prompt that exceeds the request limit', async () => {
    const response = await request(app).post('/api/ai/query').send({ userPrompt: 'x'.repeat(2001) });

    expect(response.status).toBe(400);
  });

  test('scopes the primary query and joined forms to the persisted active event', async () => {
    mockBedrockSend
      .mockResolvedValueOnce(bedrockTextResponse(JSON.stringify([
        {
          $lookup: {
            from: 'PIT_FORMS',
            localField: 'teamNumber',
            foreignField: 'teamNumber',
            as: 'pitForms',
          },
        },
        { $group: { _id: '$teamNumber', records: { $sum: 1 } } },
      ])))
      .mockResolvedValueOnce(bedrockTextResponse('Teams with scouting records were reviewed.'));

    const response = await request(app)
      .post('/api/ai/query')
      .send({ userPrompt: 'Which teams have pit data?' });

    expect(response.status).toBe(200);
    expect(response.body.answer).toBe('Teams with scouting records were reviewed.');
    const pipeline = mockAggregate.mock.calls[0][0];
    expect(pipeline[0]).toEqual({ $match: { event: 'TEST_EVENT' } });
    expect(pipeline[2].$unionWith).toEqual({
      coll: 'PIT_FORMS',
      pipeline: [
        { $match: { event: 'TEST_EVENT' } },
        { $addFields: { _aiFormSource: 'pit' } },
      ],
    });
    expect(pipeline.find((stage) => stage.$lookup).$lookup.pipeline[0])
      .toEqual({ $match: { event: 'TEST_EVENT' } });
    expect(mockAggregateOption).toHaveBeenCalledWith({ maxTimeMS: 10000, allowDiskUse: false });
  });

  test('can correlate pit-form text and stand-form climb data by team', async () => {
    const teamCorrelation = {
      $group: {
        _id: '$teamNumber',
        hasSwerve: {
          $max: {
            $cond: [
              {
                $and: [
                  { $eq: ['$_aiFormSource', 'pit'] },
                  { $regexMatch: { input: { $ifNull: ['$strongestValue', ''] }, regex: 'swerve', options: 'i' } },
                ],
              },
              1,
              0,
            ],
          },
        },
        hasClimbed: {
          $max: {
            $cond: [
              { $and: [{ $eq: ['$_aiFormSource', 'stand'] }, { $eq: ['$didClimb', true] }] },
              1,
              0,
            ],
          },
        },
      },
    };
    mockBedrockSend
      .mockResolvedValueOnce(bedrockTextResponse(JSON.stringify([
        teamCorrelation,
        { $match: { hasSwerve: 1, hasClimbed: 1 } },
        { $project: { _id: 0, teamNumber: '$_id' } },
      ])))
      .mockResolvedValueOnce(bedrockTextResponse('Team 1234 has matching pit and climb records.'));

    const response = await request(app)
      .post('/api/ai/query')
      .send({ userPrompt: 'Find teams who have swerve drive and also climbed at least once' });

    expect(response.status).toBe(200);
    expect(response.body.answer).toContain('Team 1234');
    expect(mockAggregate.mock.calls[0][0]).toContainEqual(teamCorrelation);
  });
});