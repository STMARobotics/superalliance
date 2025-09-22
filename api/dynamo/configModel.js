const { docClient } = require("./dynamoClient");
const { TABLES } = require("./tables");
const { PutCommand, QueryCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

// Simple single-item config by year (or default)
function pk() { return "CONFIG"; }
function sk(year = "DEFAULT") { return `YEAR#${year}`; }

async function putConfig(config, year = "DEFAULT") {
  const now = new Date().toISOString();
  const names = { "#entity": "entity", "#createdAt": "createdAt", "#updatedAt": "updatedAt" };
  const values = { ":entity": "Config", ":now": now };
  const sets = ["#entity = if_not_exists(#entity, :entity)", "#createdAt = if_not_exists(#createdAt, :now)", "#updatedAt = :now"]; 
  // Flatten config keys into expression
  for (const [k, v] of Object.entries(config || {})) {
    const nameKey = `#cfg_${k}`;
    const valueKey = `:cfg_${k}`;
    names[nameKey] = k;
    values[valueKey] = v;
    sets.push(`${nameKey} = ${valueKey}`);
  }
  const res = await docClient.send(new UpdateCommand({
    TableName: TABLES.CONFIG,
    Key: { PK: pk(), SK: sk(year) },
    UpdateExpression: `SET ${sets.join(', ')}`,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ReturnValues: "ALL_NEW",
  }));
  return res.Attributes;
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
