const { Router } = require("express");

const aggregationRouter = Router();

const mongoose = require("mongoose");
const axios = require("axios");
const StandFormAggregation = require("../models/StandFormAggregation");

aggregationRouter.get("/api/aggregation/all", async (req, res) => {
  const data = await StandFormAggregation();
  return res.send(data);
});

aggregationRouter.get("/api/aggregation/event/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const data = await StandFormAggregation(eventId);
  return res.send(data);
});

module.exports = aggregationRouter;
