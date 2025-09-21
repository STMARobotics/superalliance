const { docClient } = require("./dynamoClient");
const { TABLES } = require("./tables");
const { v4: uuidv4 } = require("uuid");
const { PutCommand, QueryCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

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
  const g = await docClient.send(new GetCommand({
    TableName: TABLES.PIT_FORMS,
    Key: { PK: pk(event), SK: sk(teamNumber) },
    ConsistentRead: true,
  }));
  return g.Item || null;
}

async function getPitFormsForEvent(event, { limit, nextToken, strong } = {}) {
  const q = await docClient.send(new QueryCommand({
    TableName: TABLES.PIT_FORMS,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: { ":pk": pk(event) },
    Limit: limit,
    ExclusiveStartKey: nextToken,
    ConsistentRead: !!strong,
  }));
  return { items: q.Items || [], nextToken: q.LastEvaluatedKey || null };
}

module.exports = { putPitForm, getPitForm, getPitFormsForEvent };
