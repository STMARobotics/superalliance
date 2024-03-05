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
// let connection = null;
let cachedMongoConn = null;

exports.handler = (event, context) => {
  // This makes the Lambda reuse the connection between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  context.callbackWaitsForEmptyEventLoop = false;


  connectDatabase()
    .then(() => awsServerlessExpress.proxy(server, event, context))
    .catch(error => {
      console.error('Could not connect to database', { error });
      throw error;
    });


  // Because connection is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  // if(connection == null) {
  //   connection = mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 10, socketTimeoutMS: 60000 })
  //     .then(() => {
  //       console.log("Connected to Mongo!");
  //       awsServerlessExpress.proxy(server, event, context);
  //     })
  //     .catch(console.error);
  // } else {
  //   console.log("Connection reused by Lambda");
  //   awsServerlessExpress.proxy(server, event, context);
  // }
  
  // awsServerlessExpress.proxy(server, event, context);
}

function connectDatabase() {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connection
      // Reject if an error occurred when trying to connect to MongoDB
      .on('error', error => {
        console.log('Error: connection to DB failed');
        reject(error);
      })
      // Exit Process if there is no longer a Database Connection
      .on('close', () => {
        console.log('Error: Connection to DB lost');
        process.exit(1);
      })
      // Connected to DB
      .once('open', () => {
        // Display connection information
        const infos = mongoose.connections;

        infos.map(info => console.log(`Connected to ${info.host}:${info.port}/${info.name}`));
        // Return successful promise
        resolve(cachedMongoConn);
      });

    // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
    // See https://docs.atlas.mongodb.com/best-practices-connecting-to-aws-lambda/
    // https://mongoosejs.com/docs/lambda.html
    if (!cachedMongoConn) {
      // Because `cachedMongoConn` is in the global scope, Lambda may retain it between
      // function calls thanks to `callbackWaitsForEmptyEventLoop`.
      // This means our Lambda function doesn't have to go through the
      // potentially expensive process of connecting to MongoDB every time.
      cachedMongoConn = mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 10, socketTimeoutMS: 60000 });
    } else {
      console.log('MongoDB: using cached database instance');
      resolve(cachedMongoConn);
    }
  });
}
