module.exports = {
  TABLES: {
    STAND_FORMS: process.env.DDB_STAND_FORMS_TABLE || "STAND_FORMS",
    PIT_FORMS: process.env.DDB_PIT_FORMS_TABLE || "PIT_FORMS",
    COMMENT_FORMS: process.env.DDB_COMMENT_FORMS_TABLE || "COMMENT_FORMS",
    TEAM_SELECTION: process.env.DDB_TEAM_SELECTION_TABLE || "TEAM_SELECTION",
    CONFIG: process.env.DDB_CONFIG_TABLE || "SUPERALLIANCE_CONFIG",
  },

  // Key patterns
  // StandForm: PK = EVENT#<event>, SK = TEAM#<team>#MATCH#<match>
  //   GSI1: PK = TEAM#<team>, SK = EVENT#<event>#MATCH#<match> (query by team across events)
  //   GSI2: PK = ID#<id> (lookup by id)
  // PitForm: PK = EVENT#<event>, SK = TEAM#<team>
  //   GSI1: PK = TEAM#<team>, SK = EVENT#<event> (latest pit per team via createdAt desc in item)
  // CommentForm: PK = EVENT#<event>#TEAM#<team>, SK = CREATED#<timestamp>
  //   GSI1: PK = TEAM#<team>, SK = CREATED#<timestamp>
  // TeamSelection: PK = SELECTION, SK = EVENT#<event>
  // Config: PK = CONFIG, SK = YEAR#<year> (or single item PK=CONFIG,SK=DEFAULT)
};
