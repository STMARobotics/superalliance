"use strict";

const mongoose = require("mongoose");

module.exports = mongoose
  .connect(process.env.MONGODB_URI, { maxPoolSize: 165 })
  .catch(console.error);
