const { Schema, model } = require("mongoose");

const StandFormSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    usersName: String,
    event: String,
    teamNumber: Number,
    matchNumber: Number,
    auto: Boolean,
    autoFuel: Number,
    autoClimb: Boolean,
    teleFuel: Number,
    shotsMissed: Number,
    bump: Boolean,
    trench: Boolean,
    didClimb: Boolean,
    climbPosition: String,
    climbLevel: String,
    backClimb: Boolean,
  centerClimbLevelOne: Boolean,
  sideClimbLevelOne: Boolean,
  centerClimbLevelTwo: Boolean,
  sideClimbLevelTwo: Boolean,
  centerClimbLevelThree: Boolean,
  sideClimbLevelThree: Boolean,
    criticals: Array,
    comments: String,
    strategy: String,
    rpEarned: Number,
    defendedAgainst: Boolean,
    defense: Boolean,
    shuttle: Boolean,
    moveWhileShoot: Boolean,
    win: Boolean,
  },
  { timestamps: true }
);

module.exports = model("StandForm", StandFormSchema, "STAND_FORMS");