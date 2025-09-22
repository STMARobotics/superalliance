const { Router } = require("express");

const commentRouter = Router();

const { addComment, getCommentsForEventTeam } = require("../dynamo/commentFormModel");
const { requireAuth } = require("@clerk/express");

// New pattern: fetch by event/team instead of formId (Dynamo doesn't use single-id access by default here)
commentRouter.get("/api/forms/comments/:event/:teamNumber", requireAuth(), async (req, res) => {
  try {
    const { event, teamNumber } = req.params;
    const { limit, nextToken } = req.query;
    const q = await getCommentsForEventTeam(event, Number(teamNumber), {
      limit: limit ? Number(limit) : undefined,
      nextToken: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString('utf8')) : undefined,
    });
    if (!limit && !nextToken) return res.send(q.items);
    const token = q.nextToken ? Buffer.from(JSON.stringify(q.nextToken)).toString('base64') : null;
    return res.send({ items: q.items, nextToken: token });
  } catch (err) {
    return res.status(500).json({ error: "Failed to list comments" });
  }
});

// Deprecated: listing all comments across all events is not supported in Dynamo without an admin-only scan.
commentRouter.get("/api/forms/comments", requireAuth(), async (req, res) => {
  return res.status(410).json({ error: "Deprecated. Use /api/forms/comments/:event/:teamNumber with pagination." });
});

commentRouter.post("/api/form/comments/submit", requireAuth(), async (req, res) => {
  try {
    const data = req.body;
    if (!data?.event || data?.teamNumber == null) {
      return res.status(400).json({ error: "event and teamNumber are required" });
    }
    if (req.headers["idempotency-key"]) {
      data._id = String(req.headers["idempotency-key"]);
    }
    const created = await addComment({
      event: data.event,
      teamNumber: data.teamNumber,
      usersName: data.usersName,
      comments: data.comments,
    });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: "Failed to submit comment" });
  }
});

module.exports = commentRouter;
