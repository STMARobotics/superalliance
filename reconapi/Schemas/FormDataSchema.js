const { Schema, model } = require('mongoose')
const FormDataSchema = new Schema({
    _id: Schema.Types.ObjectId,
    teamNumber: Number,
    matchNumber: Number,
    usersName: String,
    auto: Boolean,
    autoScoreLevel: Number,
    autoExtraPiece: {
        scored: {
            autoAmp: number | undefined,
            autoSpeaker: number | undefined,
        }
    },
    autoTaxi: boolean,
    teleop: {
        scored: {
                speaker: number | undefined,
                amp: number | undefined,
                trap: number | undefined,
        }
    },
    endgameEngaged: Boolean,
    endgameDocked: Boolean,
    comments: String,
    rankPostMatch: Number,
    win: Boolean,
    rankPointsEarned: Number,
    penalties: String,
    defenceOrCycle: Boolean,
    userRating: Number | undefined,
    eventName: String,
    criticals: Array | undefined,
    pickUpTippedCones: Number,
    pickUpFloorCones: Number,
    humanPlayerStation: Number,
}, { timestamps: true } );

module.exports = model("PitFormData", FormDataSchema, "forms")