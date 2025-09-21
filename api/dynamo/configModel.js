const { docClient } = require("./dynamoClient");
const { TABLES } = require("./tables");
const { PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

// Simple single-item config by year (or default)
function pk() { return "CONFIG"; }
function sk(year = "DEFAULT") { return `YEAR#${year}`; }

async function putConfig(config, year = "DEFAULT") {
  const now = new Date().toISOString();
  const item = {
    PK: pk(),
    SK: sk(year),
    entity: "Config",
    createdAt: now,
    updatedAt: now,
    ...config,
  };
  await docClient.send(new PutCommand({ TableName: TABLES.CONFIG, Item: item }));
  return item;
}

async function getConfig(year = "DEFAULT") {
  const q = await docClient.send(new QueryCommand({
    TableName: TABLES.CONFIG,
    KeyConditionExpression: "PK = :pk AND SK = :sk",
    ExpressionAttributeValues: { ":pk": pk(), ":sk": sk(year) },
    Limit: 1,
  }));
  return q.Items?.[0] || null;
}

module.exports = { putConfig, getConfig };
