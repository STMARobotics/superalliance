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

exports.handler = (event, context) => {
  getConnection();
  awsServerlessExpress.proxy(server, event, context);
}

async function getConnection() {
  connection = await mongoConnectPromise;
}