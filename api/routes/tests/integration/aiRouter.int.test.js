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
  ConverseCommand: jest.fn((input) => input),
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
    output: { message: { content: [{ text }] } },
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

  test('uses the selected event and generates a team-level average aggregate', async () => {
    mockBedrockSend
      .mockResolvedValueOnce(bedrockTextResponse(JSON.stringify([
        { $group: { _id: '$teamNumber', averageTeleFuel: { $avg: '$teleFuel' } } },
        { $sort: { averageTeleFuel: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, teamNumber: '$_id', averageTeleFuel: 1 } },
      ])))
      .mockResolvedValueOnce(bedrockTextResponse('These are the top teams by average teleop fuel per match.'));

    const response = await request(app)
      .post('/api/ai/query')
      .send({ userPrompt: 'Top 5 by average teleop fuel', event: 'OTHER_EVENT' });

    expect(response.status).toBe(200);
    expect(response.body.answer).toContain('average');
    const pipeline = mockAggregate.mock.calls[0][0];
    expect(pipeline[0]).toEqual({ $match: { event: 'OTHER_EVENT' } });
    expect(pipeline[1].$group._id).toBe('$teamNumber');
    expect(pipeline[1].$group.averageTeleFuel).toEqual({ $avg: '$teleFuel' });
    expect(pipeline.some((stage) => stage.$unionWith || stage.$lookup)).toBe(false);
    const generationPrompt = mockBedrockSend.mock.calls[0][0].system[0].text;
    expect(generationPrompt).toContain('Use $sum for a requested total and $avg for a requested average');
    expect(generationPrompt).toContain('"$type": "array", "$ne": []');
    expect(generationPrompt).toContain('Do NOT include markdown fences, comments, trailing commas');
    expect(mockBedrockSend.mock.calls[0][0].inferenceConfig.maxTokens).toBe(2500);
    expect(generationPrompt).not.toContain('PIT_FORMS');
    expect(mockAggregateOption).toHaveBeenCalledWith({ maxTimeMS: 10000, allowDiskUse: false });
  });

  test('repairs malformed pipeline JSON once using the parse error', async () => {
    const malformedJson = '[{"$count": "teams"}';
    mockBedrockSend
      .mockResolvedValueOnce(bedrockTextResponse(malformedJson))
      .mockResolvedValueOnce(bedrockTextResponse('[{"$count":"teams"}]'))
      .mockResolvedValueOnce(bedrockTextResponse('Counted teams.'));

    const response = await request(app)
      .post('/api/ai/query')
      .send({ userPrompt: 'How many teams are there?' });

    expect(response.status).toBe(200);
    expect(response.body.answer).toBe('Counted teams.');
    expect(mockBedrockSend).toHaveBeenCalledTimes(3);
    const repairPrompt = mockBedrockSend.mock.calls[1][0].system[0].text;
    expect(repairPrompt).toContain('Your previous response could not be parsed or executed');
    expect(repairPrompt).toContain('Expected');
    expect(repairPrompt).toContain(JSON.stringify(malformedJson));
    expect(mockAggregate).toHaveBeenCalledTimes(1);
  });

  test('repairs a pipeline once using the MongoDB execution error', async () => {
    mockBedrockSend
      .mockResolvedValueOnce(
        bedrockTextResponse('[{"$project":{"criticalCount":{"$size":"$criticals"}}}]'),
      )
      .mockResolvedValueOnce(bedrockTextResponse('[{"$project":{"criticalCount":{"$size":{"$cond":[{"$isArray":"$criticals"},"$criticals",[]]}}}}]'))
      .mockResolvedValueOnce(bedrockTextResponse('Counted criticals.'));
    mockAggregateExec
      .mockRejectedValueOnce(
        new Error('The argument to $size must be an array, but was of type: int'),
      )
      .mockResolvedValueOnce([{ criticalCount: 0 }]);

    const response = await request(app)
      .post('/api/ai/query')
      .send({ userPrompt: 'Count criticals' });

    expect(response.status).toBe(200);
    expect(response.body.answer).toBe('Counted criticals.');
    expect(mockBedrockSend).toHaveBeenCalledTimes(3);
    const repairPrompt = mockBedrockSend.mock.calls[1][0].system[0].text;
    expect(repairPrompt).toContain('The argument to $size must be an array');
    expect(repairPrompt).toContain('$isArray');
    expect(mockAggregate).toHaveBeenCalledTimes(2);
  });

  test('queries all events without applying an event match', async () => {
    mockBedrockSend
      .mockResolvedValueOnce(bedrockTextResponse(JSON.stringify([
        {
          $group: { _id: '$teamNumber', totalTeleFuel: { $sum: '$teleFuel' } },
        },
      ])))
      .mockResolvedValueOnce(bedrockTextResponse('These are total teleop fuel scores across all events.'));

    const response = await request(app)
      .post('/api/ai/query')
      .send({ userPrompt: 'Total teleop fuel by team', event: 'all' });

    expect(response.status).toBe(200);
    expect(response.body.answer).toContain('total');
    expect(mockAggregate.mock.calls[0][0][0].$group).toBeDefined();
    expect(mockAggregate.mock.calls[0][0][0].$match).toBeUndefined();
  });

  test('defaults to the configured event when none is selected', async () => {
    mockBedrockSend
      .mockResolvedValueOnce(bedrockTextResponse(JSON.stringify([{ $count: 'teams' }])))
      .mockResolvedValueOnce(bedrockTextResponse('Counted teams at the active event.'));

    const response = await request(app)
      .post('/api/ai/query')
      .send({ userPrompt: 'How many teams are there?' });

    expect(response.status).toBe(200);
    expect(mockAggregate.mock.calls[0][0][0]).toEqual({ $match: { event: 'TEST_EVENT' } });
  });
});