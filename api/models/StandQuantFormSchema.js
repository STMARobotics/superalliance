const { Schema, model } = require("mongoose");

const StandQuantFormSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    usersName: String,
    event: String,
    teamNumber: Number,
    matchNumber: Number,
    autoFuel: Number,
    shotsMissed: Number,
    teleFuel: Number,
  },
  { timestamps: true }
);

module.exports = model("StandQuantForm", StandQuantFormSchema, "STAND_QUANT_FORMS");