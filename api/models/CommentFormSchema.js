const { Schema, model } = require("mongoose");

const CommentFormSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    event: String,
    teamNumber: Number,
    usersName: String,
    comment: String,
  },
  { timestamps: true },
);

module.exports = model("CommentForm", CommentFormSchema, "commentForms");
