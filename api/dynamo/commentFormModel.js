const { docClient } = require("./dynamoClient");
const { TABLES } = require("./tables");
const { v4: uuidv4 } = require("uuid");
const { PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

function pk(event, teamNumber) { return `EVENT#${event}#TEAM#${teamNumber}`; }
function sk(createdAt) { return `CREATED#${createdAt}`; }
const GSI_BY_TEAM = "GSI1"; // PK: TEAM#<team>, SK: CREATED#<timestamp>

function gsi1pk(teamNumber) { return `TEAM#${teamNumber}`; }
function gsi1sk(createdAt) { return `CREATED#${createdAt}`; }

async function addComment(item) {
  const id = item._id || uuidv4();
  const now = new Date().toISOString();
  const created = item.createdAt || now;
  const putItem = {
    PK: pk(item.event, item.teamNumber),
    SK: sk(created),
    GSI1PK: gsi1pk(item.teamNumber),
    GSI1SK: gsi1sk(created),
    id,
    entity: "CommentForm",
    createdAt: created,
    updatedAt: now,
    ...item,
  };
  await docClient.send(new PutCommand({
    TableName: TABLES.COMMENT_FORMS,
    Item: putItem,
  }));
  return putItem;
}

async function getCommentsForEventTeam(event, teamNumber, limit = 50) {
  const q = await docClient.send(new QueryCommand({
    TableName: TABLES.COMMENT_FORMS,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: { ":pk": pk(event, teamNumber) },
    ScanIndexForward: false,
    Limit: limit,
  }));
  return q.Items || [];
}

module.exports = { addComment, getCommentsForEventTeam };
