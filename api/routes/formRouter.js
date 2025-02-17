const { Router } = require("express");

const formRouter = Router();

const StandFormSchema = require("../models/StandFormSchema");
const mongoose = require("mongoose");

formRouter.get("/api/form/stand/:formId", async (req, res) => {
  const formId = req.params?.formId;
  const data = await StandFormSchema.find({
    _id: formId,
  }).catch((err) => null);
  if (!data) return res.status(404).json({ error: "Form not found" });
  return res.send(data[0]);
});

formRouter.delete("/api/form/stand/:formId", async (req, res) => {
  const formId = req.params?.formId;
  await StandFormSchema.deleteOne({
    _id: formId,
  })
    .then(() => {
      return res.send("Form deleted successfully.");
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

formRouter.get("/api/forms/stand", async (req, res) => {
  const forms = await StandFormSchema.find({}).sort({
    _id: -1,
  });
  return res.send(forms);
});

formRouter.post("/api/form/stand/submit", async (req, res) => {
  const data = req.body;
  const sendForm = await new StandFormSchema({
    _id: new mongoose.Types.ObjectId(),
  autoCoralL1: data.autoCoralL1,
  autoCoralL2: data.autoCoralL2,
  autoCoralL3: data.autoCoralL3,
  autoCoralL4: data.autoCoralL4,
  autoAlgaeProcessor: data.autoAlgaeProcessor,
  autoAlgaeNet: data.autoAlgaeNet,
  teleopCoralL1: data.teleopCoralL1,
  teleopCoralL2: data.teleopCoralL2,
  teleopCoralL3: data.teleopCoralL3,
  teleopCoralL4: data.teleopCoralL4,
  teleopAlgaeProcessor: data.teleopAlgaeProcessor,
  teleopAlgaeNet: data.teleopAlgaeNet,
  shallowClimb: data.shallowClimb,
  deepClimb: data.deepClimb,
  win: data.win,
  event: data.event,
  teamNumber: data.teamNumber,
  matchNumber: data.matchNumber,
  usersName: data.usersName,
  leave: data.leave,
  park: data.park,
  criticals: data.criticals,
  comments: data.comments,
  strategy: data.strategy,
  rpEarned: data.rpEarned,
  defendedAgainst: data.defendedAgainst,
  defense: data.defense,
  });

  await sendForm.save().catch((err) => {
    return res.status(500).send(err);
  });

  return res.send("Submitted Form!");
});

module.exports = formRouter;
