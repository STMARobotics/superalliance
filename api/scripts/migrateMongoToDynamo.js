#!/usr/bin/env node
/**
 * Migration script: Mongo JSON export -> DynamoDB
 *
 * Input files (examples):
 *   - dumps/stand_forms.json  (array of docs)
 *   - dumps/pit_forms.json
 *   - dumps/comment_forms.json
 *   - dumps/team_selection.json (single object with { event, teams })
 *   - dumps/config.json (single object with { event } or { year, ... })
 *
 * Usage:
 *   npm run migrate -- --dir=./dumps
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { docClient } = require('../dynamo/dynamoClient');
const { TABLES } = require('../dynamo/tables');
const { BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

function toArray(x) { return Array.isArray(x) ? x : (x ? [x] : []); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf-8')); }

// Key helpers (match models)
const StandKeys = {
  pk: (event) => `EVENT#${event}`,
  sk: (team, match) => `TEAM#${team}#MATCH#${match}`,
  gsi1pk: (team) => `TEAM#${team}`,
  gsi1sk: (event, match) => `EVENT#${event}#MATCH#${match}`,
  gsi2pk: (id) => `ID#${id}`,
};
const PitKeys = {
  pk: (event) => `EVENT#${event}`,
  sk: (team) => `TEAM#${team}`,
  gsi1pk: (team) => `TEAM#${team}`,
  gsi1sk: (event) => `EVENT#${event}`,
};
const CommentKeys = {
  pk: (event, team) => `EVENT#${event}#TEAM#${team}`,
  sk: (iso) => `CREATED#${iso}`,
  gsi1pk: (team) => `TEAM#${team}`,
  gsi1sk: (iso) => `CREATED#${iso}`,
};

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function batchWriteAll(tableName, puts) {
  // DynamoDB BatchWriteItem max 25 per request
  const batches = chunk(puts, 25);
  for (const b of batches) {
    let requestItems = {};
    requestItems[tableName] = b.map(Item => ({ PutRequest: { Item } }));
    let unprocessed = null;
    let attempt = 0;
    do {
      const resp = await docClient.send(new BatchWriteCommand({ RequestItems: requestItems }));
      unprocessed = resp.UnprocessedItems && resp.UnprocessedItems[tableName] || [];
      if (unprocessed.length) {
        // simple backoff
        await new Promise(r => setTimeout(r, Math.min(1000 * (attempt+1), 5000)));
        requestItems[tableName] = unprocessed;
      }
      attempt++;
    } while (unprocessed.length && attempt < 5);
    if (unprocessed.length) {
      console.warn(`Warning: ${unprocessed.length} unprocessed items for ${tableName}`);
    }
  }
}

function mapStandForm(doc) {
  const id = (doc._id && (doc._id.$oid || doc._id)) || uuidv4();
  const now = new Date().toISOString();
  return {
    PK: StandKeys.pk(doc.event),
    SK: StandKeys.sk(doc.teamNumber, doc.matchNumber),
    GSI1PK: StandKeys.gsi1pk(doc.teamNumber),
    GSI1SK: StandKeys.gsi1sk(doc.event, doc.matchNumber),
    GSI2PK: StandKeys.gsi2pk(id),
    id,
    entity: 'StandForm',
    createdAt: doc.createdAt || now,
    updatedAt: doc.updatedAt || now,
    ...doc,
  };
}

function mapPitForm(doc) {
  const id = (doc._id && (doc._id.$oid || doc._id)) || uuidv4();
  const now = new Date().toISOString();
  return {
    PK: PitKeys.pk(doc.event),
    SK: PitKeys.sk(doc.teamNumber),
    GSI1PK: PitKeys.gsi1pk(doc.teamNumber),
    GSI1SK: PitKeys.gsi1sk(doc.event),
    id,
    entity: 'PitForm',
    createdAt: doc.createdAt || now,
    updatedAt: doc.updatedAt || now,
    ...doc,
  };
}

function mapComment(doc) {
  const id = (doc._id && (doc._id.$oid || doc._id)) || uuidv4();
  const created = doc.createdAt || new Date().toISOString();
  const now = new Date().toISOString();
  return {
    PK: CommentKeys.pk(doc.event, doc.teamNumber),
    SK: CommentKeys.sk(created),
    GSI1PK: CommentKeys.gsi1pk(doc.teamNumber),
    GSI1SK: CommentKeys.gsi1sk(created),
    id,
    entity: 'CommentForm',
    createdAt: created,
    updatedAt: now,
    ...doc,
  };
}

async function migrateDir(dir) {
  console.log(`Migrating from dir: ${dir}`);
  const paths = fs.readdirSync(dir);

  if (paths.includes('stand_forms.json')) {
    const data = readJson(path.join(dir, 'stand_forms.json'));
    console.log(`Stand forms: ${data.length}`);
    await batchWriteAll(TABLES.STAND_FORMS, data.map(mapStandForm));
  }
  if (paths.includes('pit_forms.json')) {
    const data = readJson(path.join(dir, 'pit_forms.json'));
    console.log(`Pit forms: ${data.length}`);
    await batchWriteAll(TABLES.PIT_FORMS, data.map(mapPitForm));
  }
  if (paths.includes('comment_forms.json')) {
    const data = readJson(path.join(dir, 'comment_forms.json'));
    console.log(`Comment forms: ${data.length}`);
    await batchWriteAll(TABLES.COMMENT_FORMS, data.map(mapComment));
  }
  if (paths.includes('team_selection.json')) {
    const data = readJson(path.join(dir, 'team_selection.json'));
    const now = new Date().toISOString();
    const items = toArray(data).map(s => ({
      PK: 'SELECTION',
      SK: `EVENT#${s.event || 'DEFAULT'}`,
      entity: 'TeamSelection',
      createdAt: now,
      updatedAt: now,
      teams: s.teams || [],
      event: s.event || 'DEFAULT',
    }));
    await batchWriteAll(TABLES.TEAM_SELECTION, items);
  }
  if (paths.includes('config.json')) {
    const data = readJson(path.join(dir, 'config.json'));
    const now = new Date().toISOString();
    const items = toArray(data).map(c => ({
      PK: 'CONFIG',
      SK: `YEAR#${c.year || 'DEFAULT'}`,
      entity: 'Config',
      createdAt: now,
      updatedAt: now,
      ...c,
    }));
    await batchWriteAll(TABLES.CONFIG, items);
  }

  console.log('Migration complete');
}

const dirArg = process.argv.find(a => a.startsWith('--dir='));
const dir = dirArg ? dirArg.split('=')[1] : path.join(process.cwd(), 'dumps');

migrateDir(dir).catch((err) => {
  console.error('Migration failed', err);
  process.exit(1);
});
