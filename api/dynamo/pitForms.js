import { ddbDoc } from "./dynamoClient.js";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
const { randomUUID } = require("crypto");

const TABLE = process.env.DDB_PIT_FORMS_TABLE;

const pk = (eventCode) => `EVENT#${eventCode}`;
const sk = (teamNumber) => `PIT#TEAM#${teamNumber}`;

export async function getPitForm(eventCode, teamNumber) {
  const res = await ddbDoc.send(new GetCommand({
    TableName: TABLE,
    Key: { PK: pk(eventCode), SK: sk(teamNumber) }
  }));
  return res.Item || null;
}

export async function listPitFormsByEvent(eventCode) {
  const res = await ddbDoc.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
    ExpressionAttributeValues: {
      ":pk": pk(eventCode),
      ":prefix": "PIT#TEAM#"
    }
  }));
  return res.Items || [];
}

export async function createPitForm(form) {
  // form must include: event, teamNumber
  const now = new Date().toISOString();
  const item = {
    PK: pk(form.event),
    SK: sk(form.teamNumber),
    entity: "PIT_FORM",
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...form,
  };
  // Prevent overwrite if it already exists
  await ddbDoc.send(new PutCommand({
    TableName: TABLE,
    Item: item,
    ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
  }));
  return item;
}