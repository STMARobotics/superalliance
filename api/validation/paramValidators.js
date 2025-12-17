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

module.exports = {
  yearSchema,
  eventCodeSchema,
  eventIdSchema,
  teamNumberSchema,
  matchNumberSchema,
  formIdSchema,
  ACCEPTED_IMAGE_TYPES,
  commentSubmitSchema,
  pitImageUploadSchema,
};
