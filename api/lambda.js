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
const mongoConnectPromise = require('./mongo-connect');
let connection = null;

module.exports.handler = async function(event, context) {
  connection = await mongoConnectPromise;
  awsServerlessExpress.proxy(server, event, context);
}