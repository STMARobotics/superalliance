const { Router } = require("express");

const teamSelectionRouter = Router();

const TeamSelectionSchema = require("../models/TeamSelectionSchema");
const mongoose = require("mongoose");

teamSelectionRouter.post("/api/teamSelection/save", async (req, res) => {
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

teamSelectionRouter.get("/api/teamSelection", async (req, res) => {
  const selection = await TeamSelectionSchema.findOne({});
  if (!selection) return res.send({});
  return res.send(selection);
});

module.exports = teamSelectionRouter;
