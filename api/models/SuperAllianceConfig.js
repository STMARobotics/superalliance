const { Schema, model } = require("mongoose");

const SuperAllianceConfig = new Schema({
  _id: Schema.Types.ObjectId,
  event: String,
});

module.exports = model(
  "SuperAllianceConfig",
  SuperAllianceConfig,
  "superAllianceConfig"
);
