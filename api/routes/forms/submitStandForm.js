const app = require("../../index");
const StandFormSchema = require("../../models/StandFormSchema");
const mongoose = require("mongoose");

app.post("/api/form/stand/submit", async (req, res) => {
  const data = req.body;
  const sendForm = await new StandFormSchema({
    _id: new mongoose.Types.ObjectId(),
    teamNumber: data.teamNumber,
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
