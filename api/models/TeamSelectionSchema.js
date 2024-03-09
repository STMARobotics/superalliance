const { Schema, model } = require("mongoose");

const TeamSelectionSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    teams: Array,
  },
  { timestamps: true }
);

module.exports = model("TeamSelection", TeamSelectionSchema, "teamSelection");
