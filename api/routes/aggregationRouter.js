const { Router } = require("express");

const aggregationRouter = Router();

const mongoose = require("mongoose");
const axios = require("axios");
const StandFormAggregation = require("../models/StandFormAggregation");
const { requireAuth } = require("@clerk/express");

aggregationRouter.get("/api/aggregation/event/:eventId", requireAuth(), async (req, res) => {
  const { eventId } = req.params;
  const data = await StandFormAggregation(eventId);
  return res.send(data);
});

module.exports = aggregationRouter;
