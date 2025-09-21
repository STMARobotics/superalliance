const { docClient } = require("./dynamoClient");
const { TABLES } = require("./tables");
const { PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

function pk() { return "SELECTION"; }
function sk(event) { return `EVENT#${event}`; }

async function putTeamSelection(event, teams) {
  const now = new Date().toISOString();
  const item = {
    PK: pk(),
    SK: sk(event),
    entity: "TeamSelection",
    createdAt: now,
    updatedAt: now,
    teams,
    event,
  };
  await docClient.send(new PutCommand({
    TableName: TABLES.TEAM_SELECTION,
    Item: item,
  }));
  return item;
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
