const app = require("../../index");
const PitFormSchema = require("../../models/PitFormSchema");
const mongoose = require("mongoose");

app.post("/api/form/pit/submit", async (req, res) => {
  const data = req.body;
  const sendForm = await new PitFormSchema({
    _id: new mongoose.Types.ObjectId(),
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
    scoreShoot: data.scoreShoot,
    scorePickup: data.scorePickup,
    scoreOther: data.scoreOther,
    scoreOtherExplain: data.scoreOtherExplain,
    pickupGround: data.pickupGround,
    pickupSource: data.pickupSource,
    pickupOther: data.pickupOther,
    pickupOtherExplain: data.pickupOtherExplain,
    auto: data.auto,
    autoCount: data.autoCount,
    idealAuto: data.idealAuto,
    canScoreSpeaker: data.canScoreSpeaker,
    canScoreAmp: data.canScoreAmp,
    canScoreTrap: data.canScoreTrap,
    fitUnderStage: data.fitUnderStage,
    climbInfo: data.climbInfo,
    humanPlayerInfo: data.humanPlayerInfo,
    robotIssues: data.robotIssues,
    preferredDriverStation: data.preferredDriverStation,
    preferedHumanPlayerPlacement: data.preferedHumanPlayerPlacement,
    strongestValue: data.strongestValue,
    weakestValue: data.weakestValue,
    extraComments: data.extraComments,
    directContact: data.directContact,
  });

  await sendForm.save().catch((err) => {
    return res.status(500).send(err);
  });

  return res.send("Submitted Form!");
});
