// Centralized DynamoDB DocumentClient (CommonJS)
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
const ENDPOINT = process.env.DYNAMODB_ENDPOINT || undefined; // only for local/dev

const ddbClient = new DynamoDBClient({ region: REGION, endpoint: ENDPOINT });

const docClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: { wrapNumbers: false },
});

module.exports = { ddbClient, docClient };
