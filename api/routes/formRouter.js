const { Router } = require("express");

const formRouter = Router();

const { createStandForm, getStandFormById, getStandFormsByEvent, deleteStandFormById } = require("../dynamo/standFormModel");
const { requireAuth, getAuth } = require("@clerk/express");

formRouter.get("/api/form/stand/:formId", requireAuth(), async (req, res) => {
  const formId = req.params?.formId;
  try {
    const data = await getStandFormById(formId);
    if (!data) return res.status(404).json({ error: "Form not found" });
    return res.send(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to retrieve form" });
  }
});

formRouter.delete("/api/form/stand/:formId", requireAuth(), async (req, res) => {
  const userRole = getAuth(req).sessionClaims?.data?.role;
  if (userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  try {
    const deleted = await deleteStandFormById(req.params?.formId);
    if (!deleted) return res.status(404).json({ error: "Form not found" });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete form" });
  }
});

formRouter.get("/api/forms/stand/:eventCode", requireAuth(), async (req, res) => {
  const { eventCode } = req.params;
  if (!eventCode) return res.status(500).json({ error: "Missing event code" });
  try {
    const { limit, nextToken } = req.query;
    const q = await getStandFormsByEvent(eventCode, {
      limit: limit ? Number(limit) : undefined,
      nextToken: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString('utf8')) : undefined,
    });
    if (!limit && !nextToken) return res.send(q.items);
    const token = q.nextToken ? Buffer.from(JSON.stringify(q.nextToken)).toString('base64') : null;
    return res.send({ items: q.items, nextToken: token });
  } catch (err) {
    return res.status(500).json({ error: "Failed to list forms" });
  }
});

formRouter.post("/api/form/stand/submit", requireAuth(), async (req, res) => {
  try {
    const data = req.body;
    if (!data?.event || data?.teamNumber == null || data?.matchNumber == null) {
      return res.status(400).json({ error: "event, teamNumber, and matchNumber are required" });
    }
    if (req.headers["idempotency-key"]) {
      data._id = String(req.headers["idempotency-key"]);
    }
    const created = await createStandForm({
      usersName: data.usersName,
      event: data.event,
      teamNumber: data.teamNumber,
      matchNumber: data.matchNumber,
      leave: data.leave,
      autoCoralL1: data.autoCoralL1,
      autoCoralL2: data.autoCoralL2,
      autoCoralL3: data.autoCoralL3,
      autoCoralL4: data.autoCoralL4,
      autoAlgaeProcessor: data.autoAlgaeProcessor,
      autoAlgaeNet: data.autoAlgaeNet,
      teleopCoralL1: data.teleopCoralL1,
      teleopCoralL2: data.teleopCoralL2,
      teleopCoralL3: data.teleopCoralL3,
      teleopCoralL4: data.teleopCoralL4,
      teleopAlgaeProcessor: data.teleopAlgaeProcessor,
      teleopAlgaeNet: data.teleopAlgaeNet,
      park: data.park,
      shallowClimb: data.shallowClimb,
      deepClimb: data.deepClimb,
      criticals: data.criticals,
      comments: data.comments,
      strategy: data.strategy,
      rpEarned: data.rpEarned,
      defendedAgainst: data.defendedAgainst,
      defense: data.defense,
      win: data.win,
    });
    res.setHeader('Location', `/api/form/stand/${encodeURIComponent(created.id)}`);
    return res.status(201).json(created);
  } catch (err) {
    if (err?.name === "ConditionalCheckFailedException") {
      return res.status(409).json({ error: "Form already exists for this team+match" });
    }
    return res.status(500).json({ error: "Failed to submit form" });
  }
});

module.exports = formRouter;
