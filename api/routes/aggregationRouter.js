const { Router } = require("express");

const aggregationRouter = Router();

const mongoose = require("mongoose");
const axios = require("axios");
const PitFormAggregation = require("../models/PitFormAggregation");

aggregationRouter.get("/api/aggregation/all", async (req, res) => {
  const data = await PitFormAggregation();
  return res.send(data);
});

aggregationRouter.get("/api/aggregation/event/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const data = await PitFormAggregation(eventId);
  return res.send(data);
});

module.exports = aggregationRouter;
