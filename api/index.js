require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const fs = require("node:fs");
const path = require("node:path");
var cors = require("cors");

const environment = process.env.ENVIRONMENT || "local";

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
const bodyParser = require("body-parser");
const eventRouter = require("./routes/eventRouter");
const formRouter = require("./routes/formRouter");
const pitFormRouter = require("./routes/pitFormRouter");
const teamRouter = require("./routes/teamRouter");
const aggregationRouter = require("./routes/aggregationRouter");
const settingsRouter = require("./routes/settingsRouter");
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(aggregationRouter);
app.use(eventRouter);
app.use(formRouter);
app.use(pitFormRouter);
app.use(teamRouter);
app.use(settingsRouter);

app.options("/api/*", cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("Connected to Mongo!"))
  .catch(console.error);

module.exports = app;
