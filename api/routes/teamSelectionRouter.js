const { Router } = require("express");

const teamSelectionRouter = Router();

const TeamSelectionSchema = require("../models/TeamSelectionSchema");
const mongoose = require("mongoose");
const { requireAuth, getAuth } = require("@clerk/express");

teamSelectionRouter.post("/api/teamSelection/save", requireAuth(), async (req, res) => {
  const userRole = getAuth(req).sessionClaims?.data?.role;

  if (userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  const data = req.body;

  const currSelection = await TeamSelectionSchema.findOne({});

  if (!currSelection) {
    const sendSelection = await new TeamSelectionSchema({
      _id: new mongoose.Types.ObjectId(),
      teams: data.teams,
    });

    await sendSelection.save().catch((err) => {
      return res.status(500).send(err);
    });
  } else {
    await TeamSelectionSchema.findOneAndReplace({}, data);
  }

  return res.send("Submitted Team Selection!");
});

teamSelectionRouter.get("/api/teamSelection", requireAuth(), async (req, res) => {
  const userRole = getAuth(req).sessionClaims?.data?.role;

  if (userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  const selection = await TeamSelectionSchema.findOne({});
  if (!selection) return res.send({});
  return res.send(selection);
});

module.exports = teamSelectionRouter;
