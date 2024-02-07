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
    event: data.event,
    teamNumber: data.teamNumber,
    matchNumber: data.matchNumber,
    usersName: data.usersName,
    autoAmpsNotes: data.autoAmpsNotes,
    autoSpeakersNotes: data.autoSpeakersNotes,
    park: data.park,
    teleAmpsNotes: data.teleAmpsNotes,
    teleSpeakersNotes: data.teleSpeakersNotes,
    teleTrapsNotes: data.teleTrapsNotes,
    timesAmpedUsed: data.timesAmpedUsed,
    onstage: data.onstage,
    onstageSpotlight: data.onstageSpotlight,
    harmony: data.harmony,
    selfSpotlight: data.selfSpotlight,
    criticals: data.criticals,
    comments: data.comments,
    rpEarned: data.rpEarned,
    defendedAgainst: data.defendedAgainst,
    defense: data.defense,
    stockpile: data.stockpile,
    underStage: data.underStage,
    win: data.win,
  });

  await sendForm.save().catch((err) => {
    return res.status(500).send(err);
  });

  return res.send("Submitted Form!");
});

module.exports = formRouter;
