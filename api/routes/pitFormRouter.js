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
    notDo: data.notDo,
    protectedElectronics: data.protectedElectronics,
    batterySecured: data.batterySecured,
    highCenterOfMass: data.highCenterOfMass,
    coralStuck: data.coralStuck,
    coachExperience: data.coachExperience,
    operatorExperience: data.operatorExperience,
    driverExperience: data.driverExperience,
    pickupGround: data.pickupGround,
    pickupSource: data.pickupSource,
    pickupOther: data.pickupOther,
    pickupOtherExplain: data.pickupOtherExplain,
    idealAuto: data.idealAuto,
    preferredDriverStation: data.preferredDriverStation,
    preferedHumanPlayerPlacement: data.preferedHumanPlayerPlacement,
    strongestValue: data.strongestValue,
    weakestValue: data.weakestValue,
    extraComments: data.extraComments,
    pitRating: data.pitRating,
    robotRating: data.robotRating,
  });

  await sendForm.save().catch((err) => {
    return res.status(500).send(err);
  });

  return res.send("Submitted Form!");
});

pitFormRouter.get("/api/form/pit/:eventCode/:teamNumber", async (req, res) => {
  const teamNumber = req.params?.teamNumber;
  const eventCode = req.params?.eventCode;
  const data = await PitFormSchema.find({
    teamNumber: teamNumber,
    eventCode: eventCode,
  }).catch((err) => null);
  if (!data) return res.status(404).json({ error: "Form not found" });
  return res.send(data[0]);
});

module.exports = pitFormRouter;
