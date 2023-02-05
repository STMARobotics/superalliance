const { Schema, model } = require('mongoose')
const FormDataSchema = new Schema({
    _id: Schema.Types.ObjectId,
    teamNumber: Number,
    matchNumber: Number,
    usersName: String,
    auto: Boolean,
    autoEngaged: Boolean,
    autoDocked: Boolean,
    autoScoreLevel: Number,
    autoExtraPiece: {
        scored: {
            high: Number | undefined,
            mid: Number | undefined,
            low: Number | undefined,
        }
    },
    autoTaxi: Boolean,
    teleop: {
        scored: {
            cube: {
                high: Number | undefined,
                mid: Number | undefined,
                low: Number | undefined,
            },
            cone: {
                high: Number | undefined,
                mid: Number | undefined,
                low: Number | undefined,
            }
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
    eventName: String
}, { timestamps: true } );

module.exports = model("FormData", FormDataSchema, "forms")