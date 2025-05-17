const { Router } = require("express");

const settingsRouter = Router();

const SuperAllianceConfig = require("../models/SuperAllianceConfig");
const mongoose = require("mongoose");
const { requireAuth, getAuth } = require("@clerk/express");

settingsRouter.post("/api/settings/app/save", requireAuth(), async (req, res) => {
  const userRole = getAuth(req).sessionClaims?.data?.role;

  if (userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
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

settingsRouter.get("/api/settings/app", requireAuth(), async (req, res) => {
  const settings = await SuperAllianceConfig.findOne({});
  if (!settings) return res.send({});
  return res.send(settings);
});

module.exports = settingsRouter;
