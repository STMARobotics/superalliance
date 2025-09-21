// Centralized DynamoDB DocumentClient (CommonJS)
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
const ENDPOINT = process.env.DYNAMODB_ENDPOINT || undefined; // only for local/dev

const ddbClient = new DynamoDBClient({
  region: REGION,
  endpoint: ENDPOINT,
  // modest retries; SDK has backoff/jitter built-in
  maxAttempts: Number(process.env.AWS_SDK_MAX_ATTEMPTS || 3),
});

const docClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: { wrapNumbers: false },
});

module.exports = { ddbClient, docClient };
