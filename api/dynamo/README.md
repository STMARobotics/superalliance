# DynamoDB Migration Notes

This folder contains a thin data-access layer for DynamoDB to replace Mongoose models.

## Tables and Keys

Separate tables per entity (simple to migrate):

- STAND_FORMS
  - PK: `EVENT#<event>`
  - SK: `TEAM#<team>#MATCH#<matchNumber>`
  - GSI1 (by team):
    - GSI1PK: `TEAM#<team>`
    - GSI1SK: `EVENT#<event>#MATCH#<matchNumber>`
  - GSI2 (by id):
    - GSI2PK: `ID#<uuid>`

- PIT_FORMS
  - PK: `EVENT#<event>`
  - SK: `TEAM#<team>`
  - GSI1 (by team across events):
    - GSI1PK: `TEAM#<team>`
    - GSI1SK: `EVENT#<event>`

- COMMENT_FORMS
  - PK: `EVENT#<event>#TEAM#<team>`
  - SK: `CREATED#<iso-timestamp>` (newest first via ScanIndexForward=false)
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

## Next Steps

- Provision DynamoDB tables and GSIs to match the above.
- Update Express routes in `api/routes/*` to call these model helpers instead of Mongoose.
- Write a small migration script to copy Mongo data to DynamoDB following these key patterns.
