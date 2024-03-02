"use strict";
const awsServerlessExpress = require("aws-serverless-express");
const app = require("./index");
const binaryMimeTypes = [
  "application/octet-stream",
  "font/eot",
  "font/opentype",
  "font/otf",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
];
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);
const mongoose = require("mongoose");


exports.handler = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("Connected to Mongo!"))
  .catch(console.error);
  
  awsServerlessExpress.proxy(server, event, context);
}
