const { Schema, model } = require("mongoose");

const StandFormSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    usersName: String,
    event: String,
    teamNumber: Number,
    matchNumber: Number,
    leave: Boolean,
    autoCoralL1: Number,
    autoCoralL2: Number,
    autoCoralL3: Number,
    autoCoralL4: Number,
    autoAlgaeProcessor: Number,
    autoAlgaeNet: Number,
    teleopCoralL1: Number,
    teleopCoralL2: Number,
    teleopCoralL3: Number,
    teleopCoralL4: Number,
    teleopAlgaeProcessor: Number,
    teleopAlgaeNet: Number,
    park: Boolean,
    shallowClimb: Boolean,
    deepClimb: Boolean,
    criticals: Array,
    comments: String,
    strategy: String,
    rpEarned: Number,
    defendedAgainst: Boolean,
    defense: Boolean,
    win: Boolean,
  },
  { timestamps: true }
);

module.exports = model("StandForm", StandFormSchema, "STAND_FORMS");
