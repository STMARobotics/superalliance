const { Router } = require("express");

const pitFormRouter = Router();

const PitFormSchema = require("../models/PitFormSchema");
const mongoose = require("mongoose");

pitFormRouter.post("/api/form/pit/submit", async (req, res) => {
  const data = req.body;
  const sendForm = await new PitFormSchema({
    _id: new mongoose.Types.ObjectId(),
    event: data.event,
    teamNumber: data.teamNumber,
    usersName: data.usersName,
    robotImage: data.robotImage,
    overallStrategy: data.overallStrategy,
    aprilTags: data.aprilTags,
    aprilTagsUse: data.aprilTagsUse,
    protectedElectronics: data.protectedElectronics,
    batterySecured: data.batterySecured,
    cameras: data.cameras,
    cameraUsage: data.cameraUsage,
    drivetrainType: data.drivetrainType,
    drivetrainBrand: data.drivetrainBrand,
    backupSwerve: data.backupSwerve,
    complimentaryRobot: data.complimentaryRobot,
    robotChanges: data.robotChanges,
    scoreL1: false,
    scoreL2: false,
    scoreL3: false,
    scoreL4: false,
    scoreProcessor: false,
    scoreShallow: false,
    scoreOtherDeep: false,
    pickupGround: data.pickupGround,
    pickupSource: data.pickupSource,
    pickupOther: data.pickupOther,
    pickupOtherExplain: data.pickupOtherExplain,
    auto: data.auto,
    autoCount: data.autoCount,
    idealAuto: data.idealAuto,
    robotIssues: data.robotIssues,
    preferredDriverStation: data.preferredDriverStation,
    preferedHumanPlayerPlacement: data.preferedHumanPlayerPlacement,
    strongestValue: data.strongestValue,
    weakestValue: data.weakestValue,
    extraComments: data.extraComments,
  });

  await sendForm.save().catch((err) => {
    return res.status(500).send(err);
  });

  return res.send("Submitted Form!");
});

pitFormRouter.get("/api/form/pit/:teamNumber", async (req, res) => {
  const teamNumber = req.params?.teamNumber;
  const data = await PitFormSchema.find({
    teamNumber: teamNumber,
  }).catch((err) => null);
  if (!data) return res.status(404).json({ error: "Form not found" });
  return res.send(data[0]);
});

module.exports = pitFormRouter;
