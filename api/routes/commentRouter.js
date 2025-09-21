const { Router } = require("express");

const commentRouter = Router();

const { addComment, getCommentsForEventTeam } = require("../dynamo/commentFormModel");
const { requireAuth } = require("@clerk/express");

// New pattern: fetch by event/team instead of formId (Dynamo doesn't use single-id access by default here)
commentRouter.get("/api/forms/comments/:event/:teamNumber", requireAuth(), async (req, res) => {
  try {
    const { event, teamNumber } = req.params;
    const items = await getCommentsForEventTeam(event, Number(teamNumber));
    return res.send(items);
  } catch (err) {
    return res.status(500).json({ error: "Failed to list comments" });
  }
});

commentRouter.get("/api/forms/comments", requireAuth(), async (req, res) => {
  const forms = await CommentFormSchema.find({}).sort({
    _id: -1,
  });
  return res.send(forms);
});

commentRouter.post("/api/form/comments/submit", requireAuth(), async (req, res) => {
  try {
    const data = req.body;
    if (!data?.event || data?.teamNumber == null) {
      return res.status(400).json({ error: "event and teamNumber are required" });
    }
    await addComment({
      event: data.event,
      teamNumber: data.teamNumber,
      usersName: data.usersName,
      comments: data.comments,
    });
    return res.send("Submitted Form!");
  } catch (err) {
    return res.status(500).json({ error: "Failed to submit comment" });
  }
});

module.exports = commentRouter;
