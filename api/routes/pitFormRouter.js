const express = require("express");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { putPitForm: createPitForm, getPitForm, getPitFormsForEvent: listPitFormsByEvent } = require("../dynamo/pitFormModel");

const router = express.Router();

// GET /api/form/pit/:eventCode - list pit forms for an event
router.get("/:eventCode", async (req, res) => {
  try {
    const { eventCode } = req.params;
    const { limit, nextToken } = req.query;
    const q = await listPitFormsByEvent(eventCode, {
      limit: limit ? Number(limit) : undefined,
      nextToken: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString('utf8')) : undefined,
    });
    // backward-compat: default to array when no pagination requested
    if (!limit && !nextToken) return res.json(q.items);
    const token = q.nextToken ? Buffer.from(JSON.stringify(q.nextToken)).toString('base64') : null;
    res.json({ items: q.items, nextToken: token });
  } catch (err) {
    console.error("listPitFormsByEvent error", err);
    res.status(500).json({ message: "Failed to list pit forms" });
  }
});

// GET /api/form/pit/:eventCode/:teamNumber - get one team's pit form
router.get("/:eventCode/:teamNumber", async (req, res) => {
  try {
    const { eventCode, teamNumber } = req.params;
    const item = await getPitForm(eventCode, teamNumber);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    console.error("getPitForm error", err);
    res.status(500).json({ message: "Failed to get pit form" });
  }
});

// POST /api/form/pit/submit - create a pit form (one per event+team)
router.post("/submit", async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.event || !body.teamNumber) {
      return res.status(400).json({ message: "event and teamNumber are required" });
    }
    if (req.headers["idempotency-key"]) {
      body._id = String(req.headers["idempotency-key"]);
    }
    // Check if a form already exists for this event+team
    const existing = await getPitForm(body.event, body.teamNumber);
    if (existing) {
      return res.status(409).json({ message: "Pit form already exists for this team at this event" });
    }
    // Create the new pit form
    const item = await createPitForm(body);
    res.setHeader('Location', `/api/form/pit/${encodeURIComponent(item.event)}/${encodeURIComponent(item.teamNumber)}`);
    res.status(201).json(item);
  } catch (err) {
    if (err?.name === "ConditionalCheckFailedException") {
      return res.status(409).json({ message: "Pit form already exists" });
    }
    console.error("createPitForm error", err);
    res.status(500).json({ message: "Failed to create pit form" });
  }
});

// Create a signed URL for uploading robot pit images to S3
router.post("/image-upload", async (req, res) => {
  const { year, teamNumber, eventCode, fileType } = req.body;
  if (!year || !teamNumber || !eventCode || !fileType) {
    return res.status(400).json({ error: "year, teamNumber, eventCode, and fileType are required" });
  }

  const s3 = new S3Client({ region: process.env.S3_REGION || process.env.AWS_REGION });
  const bucket = process.env.S3_BUCKET;
  const extension = fileType.split("/")[1];
  const key = `${year}/${eventCode}/${teamNumber}_${Date.now()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: fileType,
    CacheControl: "public, max-age=31536000, immutable", // file name is unique, content will never change
  });

  try {
  const expiresIn = Number(process.env.SIGNED_URL_TTL || 300);
  const url = await getSignedUrl(s3, command, { expiresIn });
  const distro = process.env.ROBOT_IMAGE_DISTRO || `${bucket}.s3.${process.env.S3_REGION || process.env.AWS_REGION}.amazonaws.com`;
  const fileUrl = `https://${distro}/${key}`;
    return res.json({ url, fileUrl, key });
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate signed URL" });
  }
});

module.exports = router;
