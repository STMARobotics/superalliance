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

// exports.handler = async function(event, context) {

//   // Make sure to add this so you can re-use `conn` between function calls.
//   // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
//   context.callbackWaitsForEmptyEventLoop = false;
  
//   // Because `connection` is in the global scope, Lambda may retain it between
//   // function calls thanks to `callbackWaitsForEmptyEventLoop`.
//   // This means your Lambda function doesn't have to go through the
//   // potentially expensive process of connecting to MongoDB every time.
  
//   if (connection == null) {

//     connection = mongoose.connect(process.env.MONGODB_URI, {family: 4, serverSelectionTimeoutMS: 5000})
//       .then(() => {        
//         console.log("Connected to Mongo!");
//         return mongoose;
//       })
//       .catch(error => {
//         console.error("Error connecting to MongoDB:", err);
//       });

//     // connection = mongoose
//     // .connect(process.env.MONGODB_URI, { family: 4 })
//     // .then(console.log("Connected to Mongo!"))
//     // .catch(console.error);

//     // `await`ing connection after assigning to the `conn` variable
//     // to avoid multiple function calls creating new connections
//     await connection;
//   }

//   awsServerlessExpress.proxy(server, event, context);
// }

exports.handler = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connection = mongoose
  .connect(process.env.MONGODB_URI, { family: 4, maxPoolSize: 10 })
  .then(console.log("Connected to Mongo!"))
  .catch(console.error);

  awsServerlessExpress.proxy(server, event, context);
}
