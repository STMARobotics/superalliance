const { Schema, model } = require('mongoose')
const UserDataSchema = new Schema({
    _id: Schema.Types.ObjectId,
    users: Array | undefined,
})

module.exports = model("UserData", UserDataSchema, "users")