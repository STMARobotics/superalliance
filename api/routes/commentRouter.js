const { Router } = require("express");

const commentRouter = Router();

const CommentFormSchema = require("../models/CommentFormSchema");
const mongoose = require("mongoose");
const { requireAuth } = require("@clerk/express");
const { validateFormIdParam, validateCommentSubmitBody } = require("../validation/paramValidators");

commentRouter.param("formId", validateFormIdParam);

commentRouter.get("/api/form/comments/:formId", requireAuth(), async (req, res) => {
  const formId = req.params?.formId;
  const data = await CommentFormSchema.find({
    _id: formId,
  }).catch((err) => null);
  if (!data) return res.status(404).json({ error: "Form not found" });
  return res.send(data[0]);
});

commentRouter.get("/api/forms/comments", requireAuth(), async (req, res) => {
  const forms = await CommentFormSchema.find({}).sort({
    _id: -1,
  });
  return res.send(forms);
});

commentRouter.post("/api/form/comments/submit", requireAuth(), validateCommentSubmitBody, async (req, res) => {
  const data = req.body;
  const sendForm = await new CommentFormSchema({
    _id: new mongoose.Types.ObjectId(),
    event: data.event,
    teamNumber: data.teamNumber,
    usersName: data.usersName,
    comments: data.comments,
  });

  await sendForm.save().catch((err) => {
    return res.status(500).send(err);
  });

  return res.send("Submitted Form!");
});

module.exports = commentRouter;
