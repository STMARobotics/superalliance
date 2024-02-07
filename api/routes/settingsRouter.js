const { Router } = require("express");

const settingsRouter = Router();

const SuperAllianceConfig = require("../models/SuperAllianceConfig");
const mongoose = require("mongoose");

settingsRouter.post("/api/settings/app/save", async (req, res) => {
  const data = req.body;

  const currSettings = await SuperAllianceConfig.findOne({});

  if (!currSettings) {
    const sendSettings = await new SuperAllianceConfig({
      _id: new mongoose.Types.ObjectId(),
      event: data.event,
    });

    await sendSettings.save().catch((err) => {
      return res.status(500).send(err);
    });
  } else {
    await SuperAllianceConfig.findOneAndReplace({}, data);
  }

  return res.send("Submitted Settings!");
});

settingsRouter.get("/api/settings/app", async (req, res) => {
  const settings = await SuperAllianceConfig.findOne({});
  if (!settings) return res.send({});
  return res.send(settings);
});

module.exports = settingsRouter;
