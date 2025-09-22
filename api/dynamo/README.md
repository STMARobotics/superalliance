# DynamoDB Migration Notes

This folder contains a thin data-access layer for DynamoDB to replace Mongoose models.

## Tables and Keys (Option A: multi-table)

Separate tables per entity (simple to migrate). Keys and GSIs:

- STAND_FORMS
  - PK: `EVENT#<event>` (partition all matches for an event)
  - SK: `TEAM#<team>#MATCH#<matchNumber>` (enables ordering and per-team prefix query)
  - GSI1 (by team):
    - GSI1PK: `TEAM#<team>`
    - GSI1SK: `EVENT#<event>#MATCH#<matchNumber>`
  - GSI2 (by id):
    - GSI2PK: `ID#<uuid>`

- PIT_FORMS
  - PK: `EVENT#<event>`
  - SK: `TEAM#<team>` (natural uniqueness of one pit form per team per event)
  - GSI1 (by team across events):
    - GSI1PK: `TEAM#<team>`
    - GSI1SK: `EVENT#<event>`

- COMMENT_FORMS
  - PK: `EVENT#<event>#TEAM#<team>` (list by event+team)
  - SK: `CREATED#<iso-timestamp>` (use ScanIndexForward=false for newest first)
  - GSI1 (by team across events):
    - GSI1PK: `TEAM#<team>`
    - GSI1SK: `CREATED#<iso-timestamp>`

- TEAM_SELECTION
  - PK: `SELECTION`
  - SK: `EVENT#<event>`

- SUPERALLIANCE_CONFIG
  - PK: `CONFIG`
  - SK: `YEAR#<year>` (or `DEFAULT`)

## Item Shape Guidelines

All items include common attributes:

- `entity`: logical type (e.g., `StandForm`, `PitForm`, `CommentForm`, ...)
- `createdAt` / `updatedAt`: ISO strings
- `id`: UUID for items that previously used Mongo `_id`

Model files map the existing fields 1:1 (e.g., `usersName`, scoring fields, flags).

## Environment Variables

You can override table names using:

- `DDB_STAND_FORMS_TABLE`
- `DDB_PIT_FORMS_TABLE`
- `DDB_COMMENT_FORMS_TABLE`
- `DDB_TEAM_SELECTION_TABLE`
- `DDB_CONFIG_TABLE`

Region via `AWS_REGION` or `AWS_DEFAULT_REGION`.

## API conventions

- Pagination: list endpoints accept `limit` and `nextToken` (base64 for clients). Responses return `{ items, nextToken }`. If both are omitted, routes may return a bare array for backward compatibility.
- HTTP codes: `201 Created` for successful POSTs with `Location` header; `409 Conflict` for uniqueness violations; `400` for validation errors; `404` if not found.
- Idempotency: POSTs accept an optional `Idempotency-Key` header used as the item `id`, combined with conditional writes to prevent duplicates on retries.
- Projection: models use `ProjectionExpression` where appropriate to reduce RCUs on list endpoints.

## Next Steps

- Provision DynamoDB tables and GSIs to match the above.
- Update Express routes in `api/routes/*` to call these model helpers instead of Mongoose.
- Use the migration script to copy Mongo data to DynamoDB following these key patterns.

## Local development

- Use DynamoDB Local (Docker) and set `DYNAMODB_ENDPOINT` in `.env`. See `.env.example` for variables.
- Run the API locally with `npm run dev` in `api/`.

## Best practices adopted

- Query over Scan: All read paths use Query with well-modeled PK/SK (and begins_with on SK) instead of Scan+Filter.
- Conditional writes: Create operations use `attribute_not_exists(PK) AND attribute_not_exists(SK)` to avoid accidental overwrites and support idempotency.
- Pagination: Models accept `limit` and `nextToken` and return `{ items, nextToken }`. Routers default to array responses unless `limit`/`nextToken` is provided.
- Retry/backoff: Client configured with `maxAttempts` (env `AWS_SDK_MAX_ATTEMPTS`, default 3). SDK includes jittered backoff.
- Consistency: Optional `strong` flag propagates `ConsistentRead=true` when needed; default is eventual consistency.

## Operational settings (recommendations)

- Capacity mode: Start with On-Demand. Switch to Provisioned with auto scaling if you have predictable throughput.
- PITR: Enable Point-In-Time Recovery for critical tables.
- TTL: If you store ephemeral items, add a TTL attribute and enable TTL.
- Streams: If you need precomputed aggregations, enable Streams and process with Lambda.
- Metrics/alarms: Set CloudWatch alarms on throttling, errors, and consumed capacity.
