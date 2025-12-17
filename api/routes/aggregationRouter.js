const { Router } = require("express");

const aggregationRouter = Router();

const mongoose = require("mongoose");
const axios = require("axios");
const StandFormAggregation = require("../models/StandFormAggregation");
const { requireAuth } = require("@clerk/express");
const { eventIdSchema } = require("../validation/paramValidators");

aggregationRouter.get("/api/aggregation/event/:eventId", requireAuth(), async (req, res) => {
  const validated = eventIdSchema.safeParse(req.params.eventId);
  if (!validated.success) {
    return res.status(400).json({ 
      error: "Invalid eventId",
      details: validated.error.issues.map((e) => e.message)
    });
  }
  
  const eventId = validated.data;
  const data = await StandFormAggregation(eventId);
  return res.send(data);
});

module.exports = aggregationRouter;
