const { Router } = require("express");

const aggregationRouter = Router();

const mongoose = require("mongoose");
const axios = require("axios");
const StandFormAggregation = require("../models/StandFormAggregation");
const { requireAuth } = require("@clerk/express");
const { validateEventIdParam } = require("../validation/paramValidators");

aggregationRouter.param("eventId", validateEventIdParam);

aggregationRouter.get("/api/aggregation/event/:eventId", requireAuth(), async (req, res) => {
  const { eventId } = req.params;
  const data = await StandFormAggregation(eventId);
  return res.send(data);
});

module.exports = aggregationRouter;
