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
let connection = null;

exports.handler = (event, context) => {
  // This makes the Lambda reuse the connection between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  context.callbackWaitsForEmptyEventLoop = false;

  // Because connection is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  if(connection == null) {
    connection = mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 10, socketTimeoutMS: 60000 })
      .then(() => {
        console.log("Connected to Mongo!");
        awsServerlessExpress.proxy(server, event, context);
      })
      .catch(console.error);
  } else {
    console.log("Connection reused by Lambda");
    awsServerlessExpress.proxy(server, event, context);
  }
  
  // awsServerlessExpress.proxy(server, event, context);
}
