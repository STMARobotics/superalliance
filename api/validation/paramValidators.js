const { z } = require('zod');

const maxYear = new Date().getFullYear() + 1;

const yearSchema = z
  .coerce.number()
    .int()
    .gte(1990, { message: 'Year must be >= 1990' })
    .lte(maxYear, { message: `Year must be <= ${maxYear}` });

const eventCodeSchema = z
  .string()
  .regex(/^[A-Za-z0-9]{2,8}$/, { message: 'eventCode must be 2-8 alphanumeric characters' });

const eventIdSchema = z
  .string()
  .regex(/^[A-Za-z0-9]{2,8}$/, { message: 'eventId must be 2-8 alphanumeric characters' });

const teamNumberSchema = z
  .coerce.number()
  .int()
  .gt(0, { message: 'teamNumber must be > 0' })
  .lt(25600, { message: 'teamNumber must be < 25600' });

const matchNumberSchema = z
  .coerce.number()
  .int()
  .min(1, { message: 'matchNumber must be >= 1' })
  .max(100, { message: 'matchNumber must be <= 100' });

const formIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, { message: 'formId must be a 24-char hex ObjectId' });

// Accepted smartphone camera image types (normalized to lowercase)
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
];

const fileTypeSchema = z
  .string()
  .transform((s) => s.toLowerCase())
  .refine((t) => ACCEPTED_IMAGE_TYPES.includes(t), {
    message: 'Unsupported image file type',
  });

const commentSubmitSchema = z
  .object({
    event: eventCodeSchema,
    teamNumber: teamNumberSchema,
  })
  .catchall(z.unknown());

const pitImageUploadSchema = z
  .object({
    year: yearSchema,
    eventCode: eventCodeSchema,
    teamNumber: teamNumberSchema,
    fileType: fileTypeSchema,
  })
  .catchall(z.unknown());

function validateYearBody(req, res, next) {
  const parsed = yearSchema.safeParse(req.body?.year);
  if (parsed.success) {
    req.body.year = parsed.data;
    return next();
  }
  return res.status(400).json({
    error: 'Invalid year',
    details: parsed.error.issues.map((e) => e.message),
  });
}

function validateCommentSubmitBody(req, res, next) {
  const parsed = commentSubmitSchema.safeParse(req.body);
  if (parsed.success) {
    req.body = parsed.data; // teamNumber coerced to number, event validated
    return next();
  }
  return res.status(400).json({
    error: 'Invalid comment submission',
    details: parsed.error.issues.map((e) => e.message),
  });
}

function validatePitImageUploadBody(req, res, next) {
  const parsed = pitImageUploadSchema.safeParse(req.body);
  if (parsed.success) {
    req.body = parsed.data; // teamNumber coerced to number, eventCode validated
    return next();
  }
  return res.status(400).json({
    error: 'Invalid image upload body',
    details: parsed.error.issues.map((e) => e.message),
  });
}

function buildParamValidator(schema, paramName) {
  return (req, res, next, value) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return res.status(400).json({
        error: `Invalid ${paramName}`,
        details: parsed.error.issues.map((e) => e.message),
      });
    }
    req.params[paramName] = parsed.data;
    return next();
  };
}
const validateYearParam = buildParamValidator(yearSchema, 'year');
const validateEventCodeParam = buildParamValidator(eventCodeSchema, 'eventCode');
const validateEventIdParam = buildParamValidator(eventIdSchema, 'eventId');
const validateTeamNumberParam = buildParamValidator(teamNumberSchema, 'teamNumber');
const validateTeamParam = buildParamValidator(teamNumberSchema, 'team');
const validateMatchNumberParam = buildParamValidator(matchNumberSchema, 'matchNumber');
const validateFormIdParam = buildParamValidator(formIdSchema, 'formId');

module.exports = {
  eventCodeSchema,
  eventIdSchema,
  teamNumberSchema,
  matchNumberSchema,
  formIdSchema,
  ACCEPTED_IMAGE_TYPES,
  commentSubmitSchema,
  pitImageUploadSchema,
  validateYearParam,
  validateYearBody,
  validateCommentSubmitBody,
  validateEventCodeParam,
  validateEventIdParam,
  validateTeamNumberParam,
  validateTeamParam,
  validateMatchNumberParam,
  validateFormIdParam,
  validatePitImageUploadBody,
};
