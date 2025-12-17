const {
  yearSchema,
  eventCodeSchema,
  eventIdSchema,
  teamNumberSchema,
  matchNumberSchema,
  formIdSchema,
  commentSubmitSchema,
  pitImageUploadSchema,
} = require('./paramValidators');

describe('year schema', () => {
  test('coerces valid string to number', () => {
    const result = yearSchema.safeParse('1990');
    expect(result.success).toBe(true);
    expect(result.data).toBe(1990);
  });

  test('accepts valid number', () => {
    const result = yearSchema.safeParse(2024);
    expect(result.success).toBe(true);
    expect(result.data).toBe(2024);
  });

  test('rejects out-of-range years', () => {
    const tooFar = new Date().getFullYear() + 2;
    const result = yearSchema.safeParse(tooFar);
    expect(result.success).toBe(false);
  });

  test('rejects non-numeric', () => {
    const result = yearSchema.safeParse('abc');
    expect(result.success).toBe(false);
  });
});


describe('comment submit schema', () => {
  test('accepts valid event and teamNumber', () => {
    const result = commentSubmitSchema.safeParse({ event: 'TEST', teamNumber: '1234', comments: 'hi' });
    expect(result.success).toBe(true);
    expect(result.data.teamNumber).toBe(1234);
    expect(result.data.event).toBe('TEST');
  });

  test('preserves extra fields not in schema', () => {
    const result = commentSubmitSchema.safeParse({ 
      event: 'TEST', 
      teamNumber: 111, 
      usersName: 'Ada', 
      comments: 'Great bot', 
      other: { nested: true } 
    });
    expect(result.success).toBe(true);
    expect(result.data.event).toBe('TEST');
    expect(result.data.teamNumber).toBe(111);
    expect(result.data.usersName).toBe('Ada');
    expect(result.data.comments).toBe('Great bot');
    expect(result.data.other).toEqual({ nested: true });
  });

  test('rejects invalid event', () => {
    const result = commentSubmitSchema.safeParse({ event: '!@', teamNumber: 123 });
    expect(result.success).toBe(false);
  });

  test('rejects invalid teamNumber', () => {
    const result = commentSubmitSchema.safeParse({ event: 'TEST', teamNumber: 0 });
    expect(result.success).toBe(false);
  });
});


describe('pit image upload schema', () => {
  test('accepts valid year, eventCode, and teamNumber', () => {
    const result = pitImageUploadSchema.safeParse({ 
      year: '2024', 
      eventCode: 'TEST', 
      teamNumber: '4321', 
      fileType: 'image/png' 
    });
    expect(result.success).toBe(true);
    expect(result.data.eventCode).toBe('TEST');
    expect(result.data.teamNumber).toBe(4321);
  });

  test('rejects invalid eventCode', () => {
    const result = pitImageUploadSchema.safeParse({ eventCode: '!@', teamNumber: 1234 });
    expect(result.success).toBe(false);
  });

  test('rejects invalid teamNumber', () => {
    const result = pitImageUploadSchema.safeParse({ eventCode: 'TEST', teamNumber: 0 });
    expect(result.success).toBe(false);
  });

  test('accepts uppercased MIME types by normalizing to lowercase', () => {
    const result = pitImageUploadSchema.safeParse({ 
      year: '2024', 
      eventCode: 'TEST', 
      teamNumber: '111', 
      fileType: 'IMAGE/JPEG' 
    });
    expect(result.success).toBe(true);
    expect(result.data.fileType).toBe('image/jpeg');
  });

  test('rejects missing fileType', () => {
    const result = pitImageUploadSchema.safeParse({ 
      year: '2024', 
      eventCode: 'TEST', 
      teamNumber: '111' 
    });
    expect(result.success).toBe(false);
  });

  test('rejects unsupported fileType', () => {
    const result = pitImageUploadSchema.safeParse({ 
      year: '2024', 
      eventCode: 'TEST', 
      teamNumber: '111', 
      fileType: 'text/plain' 
    });
    expect(result.success).toBe(false);
    expect(result.error.issues.some(issue => issue.message.includes('Unsupported image file type'))).toBe(true);
  });
});


describe('eventCode schema', () => {
  test('accepts 2-8 alphanumeric', () => {
    const result = eventCodeSchema.safeParse('abc123');
    expect(result.success).toBe(true);
    expect(result.data).toBe('abc123');
  });

  test('rejects specials or wrong length', () => {
    expect(eventCodeSchema.safeParse('a').success).toBe(false);
    expect(eventCodeSchema.safeParse('toolongcode').success).toBe(false);
    expect(eventCodeSchema.safeParse('ab$').success).toBe(false);
  });
});

describe('eventId schema', () => {
  test('accepts 2-8 alphanumeric', () => {
    const result = eventIdSchema.safeParse('EVT2025');
    expect(result.success).toBe(true);
    expect(result.data).toBe('EVT2025');
  });
});

describe('teamNumber schema', () => {
  test('accepts integer >0 and <25600', () => {
    const result = teamNumberSchema.safeParse('254');
    expect(result.success).toBe(true);
    expect(result.data).toBe(254);
  });

  test('rejects 0, 25600, non-numeric', () => {
    expect(teamNumberSchema.safeParse(0).success).toBe(false);
    expect(teamNumberSchema.safeParse(25600).success).toBe(false);
    expect(teamNumberSchema.safeParse('abc').success).toBe(false);
  });
});

describe('matchNumber schema', () => {
  test('accepts 1..100', () => {
    const result = matchNumberSchema.safeParse('42');
    expect(result.success).toBe(true);
    expect(result.data).toBe(42);
  });

  test('rejects 0, 101, non-numeric', () => {
    expect(matchNumberSchema.safeParse(0).success).toBe(false);
    expect(matchNumberSchema.safeParse(101).success).toBe(false);
    expect(matchNumberSchema.safeParse('abc').success).toBe(false);
  });
});

describe('formId schema', () => {
  test('accepts 24-char hex', () => {
    const result = formIdSchema.safeParse('507f1f77bcf86cd799439011');
    expect(result.success).toBe(true);
    expect(result.data).toBe('507f1f77bcf86cd799439011');
  });

  test('rejects wrong length or non-hex', () => {
    expect(formIdSchema.safeParse('short').success).toBe(false);
    expect(formIdSchema.safeParse('g07f1f77bcf86cd799439011').success).toBe(false);
  });
});

