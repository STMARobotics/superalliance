// Helper to page through a Query until all items are collected
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("./dynamoClient");

/**
 * Query all pages for a given KeyConditionExpression.
 * opts: { TableName, IndexName, KeyConditionExpression, ExpressionAttributeValues, ExpressionAttributeNames, ScanIndexForward, ProjectionExpression, ConsistentRead }
 */
async function queryAll(opts) {
  let items = [];
  let lastKey = undefined;
  do {
    const res = await docClient.send(new QueryCommand({ ...opts, ExclusiveStartKey: lastKey }));
    if (res.Items && res.Items.length) items = items.concat(res.Items);
    lastKey = res.LastEvaluatedKey;
  } while (lastKey);
  return items;
}

module.exports = { queryAll };
