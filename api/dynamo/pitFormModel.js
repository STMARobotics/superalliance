const { docClient } = require("./dynamoClient");
const { TABLES } = require("./tables");
const { v4: uuidv4 } = require("uuid");
const { PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

function pk(event) { return `EVENT#${event}`; }
function sk(teamNumber) { return `TEAM#${teamNumber}`; }
const GSI_BY_TEAM = "GSI1"; // PK: TEAM#<team>, SK: EVENT#<event>

function gsi1pk(teamNumber) { return `TEAM#${teamNumber}`; }
function gsi1sk(event) { return `EVENT#${event}`; }

async function putPitForm(item) {
  const id = item._id || uuidv4();
  const now = new Date().toISOString();
  const putItem = {
    PK: pk(item.event),
    SK: sk(item.teamNumber),
    GSI1PK: gsi1pk(item.teamNumber),
    GSI1SK: gsi1sk(item.event),
    id,
    entity: "PitForm",
    createdAt: now,
    updatedAt: now,
    ...item,
  };
  await docClient.send(new PutCommand({
    TableName: TABLES.PIT_FORMS,
    Item: putItem,
    ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
  }));
  return putItem;
}

async function getPitForm(event, teamNumber) {
  const q = await docClient.send(new QueryCommand({
    TableName: TABLES.PIT_FORMS,
    KeyConditionExpression: "PK = :pk AND SK = :sk",
    ExpressionAttributeValues: { ":pk": pk(event), ":sk": sk(teamNumber) },
    Limit: 1,
  }));
  return q.Items?.[0] || null;
}

async function getPitFormsForEvent(event) {
  const q = await docClient.send(new QueryCommand({
    TableName: TABLES.PIT_FORMS,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: { ":pk": pk(event) },
  }));
  return q.Items || [];
}

module.exports = { putPitForm, getPitForm, getPitFormsForEvent };
