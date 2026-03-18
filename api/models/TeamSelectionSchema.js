const { Schema, model } = require("mongoose");

const TeamSelectionSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    eventCode: {
      type: String, 
      required: true,
      index: true
    },
    userId: {
      type: String,
      required: true
    },
    teams: Array,
  },
  { timestamps: true }
);

// Index for efficient queries - get latest by eventCode
TeamSelectionSchema.index({ eventCode: 1, updatedAt: -1 });

module.exports = model("TeamSelection", TeamSelectionSchema, "teamSelection");
