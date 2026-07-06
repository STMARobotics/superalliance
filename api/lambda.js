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

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await getConnection();
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};

async function getConnection() {
  if (!connection) {
    connection = await mongoConnectPromise;
  }
  return connection;
}