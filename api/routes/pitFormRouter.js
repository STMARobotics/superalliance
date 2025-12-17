const { Router } = require("express");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const pitFormRouter = Router();

const PitFormSchema = require("../models/PitFormSchema");
const mongoose = require("mongoose");
const { requireAuth, getAuth } = require("@clerk/express");
const { pitImageUploadSchema, eventCodeSchema, teamNumberSchema, ACCEPTED_IMAGE_TYPES } = require("../validation/paramValidators");

pitFormRouter.post("/api/form/pit/submit", requireAuth(), async (req, res) => {
  const data = req.body;
  const sendForm = await new PitFormSchema({
    _id: new mongoose.Types.ObjectId(),
    event: data.event,
    teamNumber: data.teamNumber,
    usersName: data.usersName,
    robotImage: data.robotImage,
    notDo: data.notDo,
    protectedElectronics: data.protectedElectronics,
    batterySecured: data.batterySecured,
    highCenterOfMass: data.highCenterOfMass,
    coralStuck: data.coralStuck,
    pickupGround: data.pickupGround,
    pickupSource: data.pickupSource,
    pickupOther: data.pickupOther,
    pickupOtherExplain: data.pickupOtherExplain,
    idealAuto: data.idealAuto,
    strongestValue: data.strongestValue,
    weakestValue: data.weakestValue,
    extraComments: data.extraComments,
    pitRating: data.pitRating,
    robotRating: data.robotRating,
  });

  const exists = await PitFormSchema.exists({
    teamNumber: sendForm.teamNumber,
    event: sendForm.event,
  });

  if (exists) return res.status(400).json({ error: "Pit form already exists for this team and event" });

  await sendForm.save().catch((err) => {
    return res.status(500).send(err);
  });

  return res.send("Submitted Form!");
});

pitFormRouter.get("/api/form/pit/:eventCode/:teamNumber", requireAuth(), async (req, res) => {
  const validatedEventCode = eventCodeSchema.safeParse(req.params.eventCode);
  const validatedTeamNumber = teamNumberSchema.safeParse(req.params.teamNumber);
  
  if (!validatedEventCode.success) {
    return res.status(400).json({ 
      error: "Invalid eventCode",
      details: validatedEventCode.error.issues.map((e) => e.message)
    });
  }
  
  if (!validatedTeamNumber.success) {
    return res.status(400).json({ 
      error: "Invalid teamNumber",
      details: validatedTeamNumber.error.issues.map((e) => e.message)
    });
  }
  
  const teamNumber = validatedTeamNumber.data;
  const eventCode = validatedEventCode.data;
  
  const data = await PitFormSchema.find({
    teamNumber: teamNumber,
    event: eventCode,
  }).catch((err) => null);
  if (!data || data.length == 0) return res.status(404).json({ error: "Form not found" });
  return res.json(data[0]);
});

// Create a signed URL for uploading robot pit images to S3
pitFormRouter.post("/api/form/pit/image-upload", requireAuth(), async (req, res) => {
  const validated = pitImageUploadSchema.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({
      error: "Invalid image upload body",
      details: validated.error.issues.map((e) => e.message),
    });
  }
  
  const { year, teamNumber, eventCode, fileType } = validated.data;
  const EXTENSION_BY_TYPE = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/heic': 'heic',
    'image/heif': 'heif',
  };

  const s3 = new S3Client({ region: process.env.AWS_REGION });
  const bucket = process.env.ROBOT_IMAGE_BUCKET;
  const extension = EXTENSION_BY_TYPE[fileType];
  const key = `${year}/${eventCode}/${teamNumber}_${Date.now()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: fileType === 'image/jpg' ? 'image/jpeg' : fileType,
    CacheControl: "public, max-age=31536000, immutable", // file name is unique, content will never change
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes
    const fileUrl = `https://${process.env.ROBOT_IMAGE_DISTRO}/${key}`;
    return res.json({ url, fileUrl, key });
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate signed URL" });
  }
});

module.exports = pitFormRouter;
