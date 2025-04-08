const { Schema, model } = require("mongoose");

const PitFormSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    event: String,
    teamNumber: Number,
    usersName: String,
    robotImage: String,
    notDo: String,
    protectedElectronics: Boolean,
    batterySecured: Boolean,
    highCenterOfMass: Boolean,
    coralStuck: Boolean,
    pickupGround: Boolean,
    pickupSource: Boolean,
    pickupOther: Boolean,
    pickupOtherExplain: String,
    idealAuto: String,
    strongestValue: String,
    weakestValue: String,
    extraComments: String,
    pitRating: Number,
    robotRating: Number,
  },
  { timestamps: true }
);

module.exports = model("PitForm", PitFormSchema, "PIT_FORMS");
