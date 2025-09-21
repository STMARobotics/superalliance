const { docClient } = require("./dynamoClient");
const { TABLES } = require("./tables");
const { v4: uuidv4 } = require("uuid");
const { PutCommand, GetCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

function pk(event) {
  return `EVENT#${event}`;
}
function sk(teamNumber, matchNumber) {
  return `TEAM#${teamNumber}#MATCH#${matchNumber}`;
}

const GSI_BY_TEAM = "GSI1"; // PK: TEAM#<team>, SK: EVENT#<event>#MATCH#<match>
const GSI_BY_ID = "GSI2";   // PK: ID#<id>

function gsi1pk(teamNumber) {
  return `TEAM#${teamNumber}`;
}
function gsi1sk(event, matchNumber) {
  return `EVENT#${event}#MATCH#${matchNumber}`;
}
function gsi2pk(id) {
  return `ID#${id}`;
}

async function createStandForm(item) {
  // item contains usersName, event, teamNumber, matchNumber, and the rest
  const id = item._id || uuidv4();
  const now = new Date().toISOString();
  const putItem = {
    PK: pk(item.event),
    SK: sk(item.teamNumber, item.matchNumber),
    GSI1PK: gsi1pk(item.teamNumber),
    GSI1SK: gsi1sk(item.event, item.matchNumber),
    GSI2PK: gsi2pk(id),
    id,
    entity: "StandForm",
    createdAt: now,
    updatedAt: now,
    ...item,
  };
  await docClient.send(new PutCommand({
    TableName: TABLES.STAND_FORMS,
    Item: putItem,
    ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
  }));
  return putItem;
}

async function getStandFormById(id) {
  const q = await docClient.send(new QueryCommand({
    TableName: TABLES.STAND_FORMS,
    IndexName: GSI_BY_ID,
    KeyConditionExpression: "GSI2PK = :id",
    ExpressionAttributeValues: { ":id": gsi2pk(id) },
    Limit: 1,
  }));
  return q.Items?.[0] || null;
}

async function getStandFormsByEvent(event) {
  const q = await docClient.send(new QueryCommand({
    TableName: TABLES.STAND_FORMS,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: { ":pk": pk(event) },
  }));
  return q.Items || [];
}

async function getStandFormsByEventTeam(event, teamNumber) {
  const q = await docClient.send(new QueryCommand({
    TableName: TABLES.STAND_FORMS,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :skprefix)",
    ExpressionAttributeValues: { ":pk": pk(event), ":skprefix": `TEAM#${teamNumber}` },
  }));
  return q.Items || [];
}

module.exports = {
  createStandForm,
  getStandFormById,
  getStandFormsByEvent,
  getStandFormsByEventTeam,
};
