const { Schema, model } = require("mongoose");

const PitFormSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    event: String,
    teamNumber: Number,
    usersName: String,
    robotImage: String,
    notDo: String,
    protectedElectronics: String,
    batterySecured: String,
    highCenterOfMass: String,
    coralStuck: String,
    coachExperience: String,
    operatorExperience: String,
    driverExperience: String,
    pickupGround: Boolean,
    pickupSource: Boolean,
    pickupOther: Boolean,
    pickupOtherExplain: String,
    idealAuto: String,
    humanPlayerInfo: String,
    preferredDriverStation: String,
    preferedHumanPlayerPlacement: String,
    strongestValue: String,
    weakestValue: String,
    extraComments: String,
    pitRating: Number,
    robotRating: Number,
  },
  { timestamps: true }
);

module.exports = model("PitForm", PitFormSchema, "PIT_FORMS");
