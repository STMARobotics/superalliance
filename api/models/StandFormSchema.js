const { Schema, model } = require("mongoose");

const StandFormSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    usersName: String,
    event: String,
    teamNumber: Number,
    matchNumber: Number,
    leave: Boolean,
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
    leftClimbLevelOne: Boolean,
    centerClimbLevelOne: Boolean,
    rightClimbLevelOne: Boolean,
    leftClimbLevelTwo: Boolean,
    centerClimbLevelTwo: Boolean,
    rightClimbLevelTwo: Boolean,
    leftClimbLevelThree: Boolean,
    centerClimbLevelThree: Boolean,
    rightClimbLevelThree: Boolean,
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