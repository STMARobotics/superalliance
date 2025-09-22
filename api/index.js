require("dotenv").config();

const express = require("express");
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
const commentRouter = require("./routes/commentRouter");
const teamSelectionRouter = require("./routes/teamSelectionRouter");
app.use(cors(corsOptions));
app.options("/^\/api\/.*$/", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// simple health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
    ddbEndpoint: process.env.DYNAMODB_ENDPOINT || null,
    tables: {
      stand: process.env.DDB_STAND_FORMS_TABLE,
      pit: process.env.DDB_PIT_FORMS_TABLE,
      comments: process.env.DDB_COMMENT_FORMS_TABLE,
      selection: process.env.DDB_TEAM_SELECTION_TABLE,
      config: process.env.DDB_CONFIG_TABLE,
    }
  });
});
app.use(aggregationRouter);
app.use(eventRouter);
app.use(formRouter);
app.use(commentRouter);
app.use(pitFormRouter);
app.use(teamRouter);
app.use(settingsRouter);
app.use(teamSelectionRouter);

module.exports = app;
