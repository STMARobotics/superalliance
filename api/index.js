require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const fs = require("node:fs");
const path = require("node:path");
var cors = require("cors");

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options("/api/*", cors());

const requireRoutes = () => {
  const foldersPath = path.join(__dirname, "routes");
  const routeFolders = fs.readdirSync(foldersPath);

  for (const folder of routeFolders) {
    const routesPath = path.join(foldersPath, folder);
    const routesFiles = fs
      .readdirSync(routesPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of routesFiles) {
      const filePath = path.join(routesPath, file);
      require(filePath);
    }
  }
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("Connected to Mongo!"))
  .catch(console.error);

module.exports = app;

if (environment == "aws") {
  requireRoutes();
} else {
  app.listen(PORT, (error) => {
    requireRoutes();
    if (!error)
      console.log(
        "Server is Successfully Running, and App is listening on port " + PORT
      );
    else console.log("Error occurred, server can't start", error);
  });
}
