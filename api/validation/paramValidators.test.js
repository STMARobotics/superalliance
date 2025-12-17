const {
  validateYearParam,
  validateYearBody,
  validateEventCodeParam,
  validateEventIdParam,
  validateTeamNumberParam,
  validateTeamParam,
  validateMatchNumberParam,
  validateFormIdParam,
  validateCommentSubmitBody,
  validatePitImageUploadBody,
} = require('./paramValidators');

const makeRes = () => {
  const res = {};
  res.statusCode = 200;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  return res;
};

const runValidator = (validator, paramName, value) => {
  const req = { params: {} };
  const res = makeRes();
  const next = jest.fn();
  validator(req, res, next, value);
  return { req, res, next, paramName };
};

describe('year validators', () => {
  test('validateYearParam coerces valid string and calls next', () => {
    const { res, req, next } = runValidator(validateYearParam, 'year', '1990');
    expect(res.statusCode).toBe(200);
    expect(req.params.year).toBe(1990);
    expect(next).toHaveBeenCalled();
  });

  test('validateYearParam rejects out-of-range', () => {
    const tooFar = String(new Date().getFullYear() + 2);
    const { res, next } = runValidator(validateYearParam, 'year', tooFar);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid year');
    expect(next).not.toHaveBeenCalled();
  });

  test('validateYearBody coerces valid body year and calls next', () => {
    const req = { body: { year: '2024' } };
    const res = makeRes();
    const next = jest.fn();

    validateYearBody(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(req.body.year).toBe(2024);
    expect(next).toHaveBeenCalled();
  });

  test('validateYearBody rejects non-numeric body year', () => {
    const req = { body: { year: 'abc' } };
    const res = makeRes();
    const next = jest.fn();

    validateYearBody(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('comment submit body validation', () => {
  const makeRes = () => {
    const res = {};
    res.statusCode = 200;
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (body) => {
      res.body = body;
      return res;
    };
    return res;
  };

  test('accepts valid event and teamNumber', () => {
    const req = { body: { event: 'TEST', teamNumber: '1234', comments: 'hi' } };
    const res = makeRes();
    const next = jest.fn();

    validateCommentSubmitBody(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(req.body.teamNumber).toBe(1234);
    expect(req.body.event).toBe('TEST');
    expect(next).toHaveBeenCalled();
  });

  test('preserves extra fields not in schema', () => {
    const req = { body: { event: 'TEST', teamNumber: 111, usersName: 'Ada', comments: 'Great bot', other: { nested: true } } };
    const res = makeRes();
    const next = jest.fn();

    validateCommentSubmitBody(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(req.body.event).toBe('TEST');
    expect(req.body.teamNumber).toBe(111);
    expect(req.body.usersName).toBe('Ada');
    expect(req.body.comments).toBe('Great bot');
    expect(req.body.other).toEqual({ nested: true });
    expect(next).toHaveBeenCalled();
  });

  test('rejects invalid event', () => {
    const req = { body: { event: '!@', teamNumber: 123 } };
    const res = makeRes();
    const next = jest.fn();

    validateCommentSubmitBody(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid comment submission');
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects invalid teamNumber', () => {
    const req = { body: { event: 'TEST', teamNumber: 0 } };
    const res = makeRes();
    const next = jest.fn();

    validateCommentSubmitBody(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid comment submission');
    expect(next).not.toHaveBeenCalled();
  });
});

describe('pit image upload body validation', () => {
  const makeRes = () => {
    const res = {};
    res.statusCode = 200;
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (body) => {
      res.body = body;
      return res;
    };
    return res;
  };

  test('accepts valid year, eventCode, and teamNumber', () => {
    const req = { body: { year: '2024', eventCode: 'TEST', teamNumber: '4321', fileType: 'image/png' } };
    const res = makeRes();
    const next = jest.fn();

    validatePitImageUploadBody(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(req.body.eventCode).toBe('TEST');
    expect(req.body.teamNumber).toBe(4321);
    expect(next).toHaveBeenCalled();
  });

  test('rejects invalid eventCode', () => {
    const req = { body: { eventCode: '!@', teamNumber: 1234 } };
    const res = makeRes();
    const next = jest.fn();

    validatePitImageUploadBody(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid image upload body');
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects invalid teamNumber', () => {
    const req = { body: { eventCode: 'TEST', teamNumber: 0 } };
    const res = makeRes();
    const next = jest.fn();

    validatePitImageUploadBody(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid image upload body');
    expect(next).not.toHaveBeenCalled();
  });

  test('accepts uppercased MIME types by normalizing to lowercase', () => {
    const req = { body: { year: '2024', eventCode: 'TEST', teamNumber: '111', fileType: 'IMAGE/JPEG' } };
    const res = makeRes();
    const next = jest.fn();

    validatePitImageUploadBody(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(req.body.fileType).toBe('image/jpeg');
    expect(next).toHaveBeenCalled();
  });

  test('rejects missing fileType', () => {
    const req = { body: { year: '2024', eventCode: 'TEST', teamNumber: '111' } };
    const res = makeRes();
    const next = jest.fn();

    validatePitImageUploadBody(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid image upload body');
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects unsupported fileType', () => {
    const req = { body: { year: '2024', eventCode: 'TEST', teamNumber: '111', fileType: 'text/plain' } };
    const res = makeRes();
    const next = jest.fn();

    validatePitImageUploadBody(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid image upload body');
    expect(Array.isArray(res.body.details)).toBe(true);
    expect(res.body.details.join(' ')).toMatch(/Unsupported image file type/);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('paramValidators', () => {
  test('eventCode accepts 2-8 alphanumeric', () => {
    const { res, req, next } = runValidator(validateEventCodeParam, 'eventCode', 'abc123');
    expect(res.statusCode).toBe(200);
    expect(req.params.eventCode).toBe('abc123');
    expect(next).toHaveBeenCalled();
  });

  test('eventCode rejects specials or wrong length', () => {
    const bad = runValidator(validateEventCodeParam, 'eventCode', 'a');
    expect(bad.res.statusCode).toBe(400);
    const bad2 = runValidator(validateEventCodeParam, 'eventCode', 'toolongcode');
    expect(bad2.res.statusCode).toBe(400);
    const bad3 = runValidator(validateEventCodeParam, 'eventCode', 'ab$');
    expect(bad3.res.statusCode).toBe(400);
  });

  test('eventId accepts 2-8 alphanumeric', () => {
    const { res, req, next } = runValidator(validateEventIdParam, 'eventId', 'EVT2025');
    expect(res.statusCode).toBe(200);
    expect(req.params.eventId).toBe('EVT2025');
    expect(next).toHaveBeenCalled();
  });

  test('teamNumber accepts integer >0 and <25600', () => {
    const { res, req, next } = runValidator(validateTeamNumberParam, 'teamNumber', '254');
    expect(res.statusCode).toBe(200);
    expect(req.params.teamNumber).toBe(254);
    expect(next).toHaveBeenCalled();
  });

  test('teamNumber rejects 0, 25600, non-numeric', () => {
    expect(runValidator(validateTeamNumberParam, 'teamNumber', 0).res.statusCode).toBe(400);
    expect(runValidator(validateTeamNumberParam, 'teamNumber', 25600).res.statusCode).toBe(400);
    expect(runValidator(validateTeamNumberParam, 'teamNumber', 'abc').res.statusCode).toBe(400);
  });

  test('team param uses same rules as teamNumber', () => {
    const { res, req, next } = runValidator(validateTeamParam, 'team', '999');
    expect(res.statusCode).toBe(200);
    expect(req.params.team).toBe(999);
    expect(next).toHaveBeenCalled();
  });

  test('matchNumber accepts 1..100', () => {
    const { res, req, next } = runValidator(validateMatchNumberParam, 'matchNumber', '42');
    expect(res.statusCode).toBe(200);
    expect(req.params.matchNumber).toBe(42);
    expect(next).toHaveBeenCalled();
  });

  test('matchNumber rejects 0, 101, non-numeric', () => {
    expect(runValidator(validateMatchNumberParam, 'matchNumber', 0).res.statusCode).toBe(400);
    expect(runValidator(validateMatchNumberParam, 'matchNumber', 101).res.statusCode).toBe(400);
    expect(runValidator(validateMatchNumberParam, 'matchNumber', 'abc').res.statusCode).toBe(400);
  });

  test('formId accepts 24-char hex', () => {
    const { res, req, next } = runValidator(validateFormIdParam, 'formId', '507f1f77bcf86cd799439011');
    expect(res.statusCode).toBe(200);
    expect(req.params.formId).toBe('507f1f77bcf86cd799439011');
    expect(next).toHaveBeenCalled();
  });

  test('formId rejects wrong length or non-hex', () => {
    expect(runValidator(validateFormIdParam, 'formId', 'short').res.statusCode).toBe(400);
    expect(runValidator(validateFormIdParam, 'formId', 'g07f1f77bcf86cd799439011').res.statusCode).toBe(400);
  });
});
