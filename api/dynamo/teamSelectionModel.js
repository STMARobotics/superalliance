const { docClient } = require("./dynamoClient");
const { TABLES } = require("./tables");
const { PutCommand, QueryCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

function pk() { return "SELECTION"; }
function sk(event) { return `EVENT#${event}`; }

async function putTeamSelection(event, teams) {
  const now = new Date().toISOString();
  const res = await docClient.send(new UpdateCommand({
    TableName: TABLES.TEAM_SELECTION,
    Key: { PK: pk(), SK: sk(event) },
    UpdateExpression: "SET #entity = if_not_exists(#entity, :entity), #createdAt = if_not_exists(#createdAt, :now), #updatedAt = :now, #teams = :teams, #event = :event",
    ExpressionAttributeNames: {
      "#entity": "entity",
      "#createdAt": "createdAt",
      "#updatedAt": "updatedAt",
      "#teams": "teams",
      "#event": "event",
    },
    ExpressionAttributeValues: {
      ":entity": "TeamSelection",
      ":now": now,
      ":teams": teams,
      ":event": event,
    },
    ReturnValues: "ALL_NEW",
  }));
  return res.Attributes;
}

async function getTeamSelection(event) {
  const q = await docClient.send(new QueryCommand({
    TableName: TABLES.TEAM_SELECTION,
    KeyConditionExpression: "PK = :pk AND SK = :sk",
    ExpressionAttributeValues: { ":pk": pk(), ":sk": sk(event) },
    Limit: 1,
  }));
  return q.Items?.[0] || null;
}

module.exports = { putTeamSelection, getTeamSelection };
