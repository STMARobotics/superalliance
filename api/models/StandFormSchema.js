const { Schema, model } = require("mongoose");

const StandFormSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    usersName: String,
    teamNumber: Number,
    autoAmpsNotes: Number,
    autoSpeakersNotes: Number,
    park: Boolean,
    teleAmpsNotes: Number,
    teleSpeakersNotes: Number,
    teleTrapsNotes: Number,
    timesAmpedUsed: Number,
    onstage: Boolean,
    onstageSpotlit: Boolean,
    harmony: Boolean,
    selfSpotlight: Boolean,
    criticals: Array,
    comments: String,
    rpEarned: Number,
    defendedAgainst: Boolean,
    defense: Boolean,
    stockpile: Boolean,
    underStage: Boolean,
    win: Boolean,
  },
  { timestamps: true }
);

module.exports = model("StandForm", StandFormSchema, "submittedForms");
