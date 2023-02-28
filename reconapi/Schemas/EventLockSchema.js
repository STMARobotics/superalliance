const { Schema, model } = require('mongoose')
const EventLockSchema = new Schema({
    _id: Schema.Types.ObjectId,
    event: String | undefined,
})

module.exports = model("EventLockData", EventLockSchema, "eventLock")