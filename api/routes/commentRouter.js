const { Router } = require("express");

const commentRouter = Router();

const CommentFormSchema = require("../models/CommentFormSchema");
const mongoose = require("mongoose");
const { requireAuth } = require("@clerk/express");
const { formIdSchema, commentSubmitSchema } = require("../validation/paramValidators");

commentRouter.get("/api/form/comments/:formId", requireAuth(), async (req, res) => {
  const validated = formIdSchema.safeParse(req.params.formId);
  if (!validated.success) {
    return res.status(400).json({ 
      error: "Invalid formId",
      details: validated.error.issues.map((e) => e.message)
    });
  }
  
  const formId = validated.data;
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

commentRouter.post("/api/form/comments/submit", requireAuth(), async (req, res) => {
  const validated = commentSubmitSchema.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({
      error: "Invalid comment submission",
      details: validated.error.issues.map((e) => e.message),
    });
  }
  
  const data = validated.data;
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
