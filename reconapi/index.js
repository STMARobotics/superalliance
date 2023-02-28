require("dotenv").config();
const mongoose = require('mongoose');
const {
  Promise
} = require('bluebird')
mongoose.set('strictQuery', true);
const FormDataSchema = require('./Schemas/FormDataSchema')
const axios = require('axios')
const moment = require('moment')

mongoose.connect(process.env.MONGODB_URL).then(console.log("Connected to Mongo!")).catch(console.error)

const express = require("express");
const app = express();
var cors = require("cors");
const UsersDataSchema = require("./Schemas/UsersDataSchema");
const EventLockSchema = require("./Schemas/EventLockSchema");
const averageAggregation = require("./Aggregations/averageAggregation");

require("crypto").randomBytes(48, function (ex, buf) {
  token = buf.toString("base64").replace(/\//g, "_").replace(/\+/g, "-");
});

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const userSchemaSend = async (data) => {
  const sendForm = await new UsersDataSchema({
    _id: mongoose.Types.ObjectId(),
    users: data
  })

  await sendForm.save().catch(console.error)
}

const eventSchemaSend = async (data) => {
  const sendEventLock = await new EventLockSchema({
    _id: mongoose.Types.ObjectId(),
    event: data
  })

  await sendEventLock.save().catch(console.error)
}

const schemaSend = async (data) => {

  const sendForm = await new FormDataSchema({
    _id: mongoose.Types.ObjectId(),
    teamNumber: data.teamNumber,
    matchNumber: data.matchNumber,
    usersName: data.usersName,
    auto: data.auto,
    autoEngaged: data.autoEngaged,
    autoDocked: data.autoDocked,
    autoScoreLevel: data.autoScoreLevel,
    autoExtraPiece: {
      scored: {
        high: data.autoExtraPiece.scored.high,
        mid: data.autoExtraPiece.scored.mid,
        low: data.autoExtraPiece.scored.low,
      }
    },
    autoTaxi: data.autoTaxi,
    teleop: {
      scored: {
        cube: {
          high: data.teleop.scored.cube.high,
          mid: data.teleop.scored.cube.mid,
          low: data.teleop.scored.cube.low,
        },
        cone: {
          high: data.teleop.scored.cone.high,
          mid: data.teleop.scored.cone.mid,
          low: data.teleop.scored.cone.low,
        }
      }
    },
    endgameEngaged: data.endgameEngaged,
    endgameDocked: data.endgameDocked,
    comments: data.comments,
    rankPostMatch: data.rankPostMatch,
    win: data.win,
    rankPointsEarned: data.rankPointsEarned,
    penalties: data.penalties,
    defenceOrCycle: data.defenceOrCycle,
    userRating: data.userRating,
    eventName: data.eventName,
    criticals: data.criticals
  })

  await sendForm.save().catch(console.error)
}

const getTeamNickname = async (teamNumber) => {

  if (teamNumber == 12345) return "Testing Team"

  try {
    const data = await axios.get(`https://www.thebluealliance.com/api/v3/team/frc${teamNumber}/simple`, {
      headers: {
        'X-TBA-Auth-Key': `${process.env.BLUEALLIANCE_KEY}`,
        'accept': 'application/json'
      }
    })
    return data.data.nickname
  } catch {
    return "Unknown Team"
  }
}

const getTeamAvatar = async (team) => {
  try {
    const data = await axios.get(`https://frc-api.firstinspires.org/v3.0/2020/avatars?teamNumber=${team}`, {
      headers: {
        'Authorization': `Basic ${process.env.FRC_API_KEY}`,
      }
    })
    return `data:image/png;base64, ${data.data.teams[0].encodedAvatar}`
  } catch {
    return "https://i0.wp.com/coderedrobotics.com/wp-content/uploads/2013/04/First-Robotics-Logo.jpg"
  }
}

const getAllFormsHomePage = async () => {
  const formData = await FormDataSchema.find({}).sort({
    _id: -1
  }).limit(5)
  return formData
}

const getAllForms = async () => {
  const formData = await FormDataSchema.find({}).sort({
    _id: -1
  })
  return formData
}

const getSubmissionById = async (submissionId) => {
  const submissionData = await FormDataSchema.find({
    _id: submissionId
  })
  return submissionData
}

const getAllFormsSorted = async (sortOption, direction) => {
  const formData = await FormDataSchema.find({}).sort({
    [sortOption]: Number(direction)
  })
  return formData
}

const getEventData = async (team, year) => {
  try {
    const data = await axios.get(`https://www.thebluealliance.com/api/v3/team/frc${team}/events/${year}`, {
      headers: {
        'X-TBA-Auth-Key': `${process.env.BLUEALLIANCE_KEY}`,
        'accept': 'application/json'
      }
    })
    return data.data
  } catch {
    return "Unknown"
  }
}

const getEventDataById = async (year, id) => {

  if (id == "testing") return {
    name: "Testing Event",
    short_name: "Testing Event"
  }

  if (id == "week0") return {
    name: "Week 0 Event",
    short_name: "Week 0 Event"
  }

  try {
    const data = await axios.get(`https://www.thebluealliance.com/api/v3/event/${year}${id}`, {
      headers: {
        'X-TBA-Auth-Key': `${process.env.BLUEALLIANCE_KEY}`,
        'accept': 'application/json'
      }
    })
    return data.data
  } catch (err) {
    return "Unknown"
  }
}

const getLandingEventData = async (team, year) => {
  var dataArray = []
  try {
    const data = await axios.get(`https://www.thebluealliance.com/api/v3/team/frc${team}/events/${year}`, {
      headers: {
        'X-TBA-Auth-Key': `${process.env.BLUEALLIANCE_KEY}`,
        'accept': 'application/json'
      }
    })
    await Promise.all(data.data.map(async (data, index) => {
      dataArray.push({
        value: data.name,
        label: data.short_name,
        eventcode: data.event_code
      })
    }))
    return dataArray
  } catch {
    return "Unknown"
  }
}

const getForms = async (teamNumber) => {

  var dataArray = []

  const formData = await FormDataSchema.find({
    teamNumber: teamNumber
  }).sort({
    _id: -1
  })
  await Promise.all(formData.map(async (data, index) => {
    dataArray.push({
      index: index,
      author: data.usersName,
      timestamp: moment(data.createdAt).format("hh:mm A"),
      win: data.win,
      matchNumber: data.matchNumber,
      rankPointsEarned: data.rankPointsEarned,
      eventName: data.eventName,
      criticals: data.criticals
    })
  }))
  return dataArray
}

const getFormData = async (teamNumber) => {

  const formData = await FormDataSchema.find({
    teamNumber: teamNumber
  }).sort({
    _id: -1
  })
  return formData
}

const getTeams = async () => {

  var teamsArray = []

  const formData = await FormDataSchema.aggregate([{
    $sort: {
      teamNumber: 1
    }
  },
  {
    $group: {
      _id: {
        teamNumber: "$teamNumber"
      },
      teamNum: {
        $first: '$teamNumber'
      }
    },
  },
  {
    $sort: {
      teamNum: 1
    }
  }
  ])

  const result = await Promise.each(formData, async (data) => {
    //const name = await getTeamNickname(data._id.teamNumber)
    const formCount = await FormDataSchema.find({
      teamNumber: data._id.teamNumber
    }).count()
    teamsArray.push({
      number: data._id.teamNumber,
      name: "Loading...",
      count: formCount
    })
  })
  return teamsArray
}

const getTeamsInEvent = async (event) => {

  var teamsArray = []

  const formData = await FormDataSchema.aggregate([{
    $sort: {
      teamNumber: 1
    }
  },
  {
    $group: {
      _id: {
        teamNumber: "$teamNumber"
      },
      teamNum: {
        $first: '$teamNumber'
      }
    },
  },
  {
    $sort: {
      teamNum: 1
    }
  }
  ])

  const result = await Promise.each(formData, async (data) => {
    //const name = await getTeamNickname(data._id.teamNumber)
    const formCount = await FormDataSchema.find({
      teamNumber: data._id.teamNumber,
      eventName: event
    }).count()
    const forms = await FormDataSchema.find({
      teamNumber: data._id.teamNumber,
      eventName: event
    })
    try {
      teamsArray.push({
        number: data._id.teamNumber,
        name: "Loading...",
        count: formCount,
        eventName: forms[0].eventName == event ? event : null
      })
    } catch {
      teamsArray.push({
        number: data._id.teamNumber,
        name: "Loading...",
        count: formCount,
        eventName: null
      })
    }
  })
  return teamsArray
}

const getTeamsAdvanced = async () => {

  var teamsArray = []

  const formData = await FormDataSchema.aggregate([{
    $sort: {
      teamNumber: 1
    }
  },
  {
    $group: {
      _id: {
        teamNumber: "$teamNumber"
      },
      eventName: {
        $first: '$eventName'
      },
      teamNum: {
        $first: '$teamNumber'
      }
    },
  },
  {
    $sort: {
      teamNum: 1
    }
  }
  ])

  await Promise.each(formData, async (data) => {
    const name = await getTeamNickname(data._id.teamNumber)
    const formCount = await FormDataSchema.find({
      teamNumber: data._id.teamNumber
    }).count()
    teamsArray.push({
      number: data._id.teamNumber,
      eventName: data.eventName,
      name: name,
      count: formCount
    })
  })
  return teamsArray
}

const getTeamsInEventAdvanced = async (event) => {

  var teamsArray = []

  const formData = await FormDataSchema.aggregate([{
    $sort: {
      teamNumber: 1
    }
  },
  {
    $group: {
      _id: {
        teamNumber: "$teamNumber"
      },
      eventName: {
        $first: '$eventName'
      },
      teamNum: {
        $first: '$teamNumber'
      }
    },
  },
  {
    $sort: {
      teamNum: 1
    }
  }
  ])

  await Promise.each(formData, async (data) => {
    const name = await getTeamNickname(data._id.teamNumber)
    const formCount = await FormDataSchema.find({
      teamNumber: data._id.teamNumber
    }).count()
    const forms = await FormDataSchema.find({
      teamNumber: data._id.teamNumber,
      eventName: event
    })
    teamsArray.push({
      number: data._id.teamNumber,
      eventName: data.eventName,
      name: name,
      count: formCount,
      eventName: forms.eventName == event ? event : null
    })
  })
  return teamsArray
}

const getAllTeamAvatars = async () => {

  var teamsArray = []

  const formData = await FormDataSchema.aggregate([{
    $sort: {
      teamNumber: 1
    }
  },
  {
    $group: {
      _id: {
        teamNumber: "$teamNumber"
      },
      teamNum: {
        $first: '$teamNumber'
      }
    },
  },
  {
    $sort: {
      teamNum: 1
    }
  }
  ])

  await Promise.each(formData, async (data) => {
    const avatar = await getTeamAvatar(data._id.teamNumber)
    teamsArray.push({
      number: data._id.teamNumber,
      avatar: avatar,
    })
  })
  return teamsArray
}

const getEventMatchNumbers = async (eventId) => {
  var matchesArray = []

  const eventName = await getEventDataById(2023, eventId)

  const formData = await FormDataSchema.aggregate([{
    $match: {
      eventName: eventName.name
    }
  },
  {
    $group: {
      _id: {
        matchNumber: "$matchNumber",
        eventName: "$eventName"
      },
    }
  },
  {
    $sort: {
      _id: 1
    },
  }
  ])

  await Promise.each(formData, (async (data) => {
    const matchCount = await FormDataSchema.find({
      eventName: data._id.eventName
    }).count()
    matchesArray.push({
      matchNum: data._id.matchNumber,
      matchEvent: data._id.eventName,
      totalMatches: matchCount
    })
  }))
  return matchesArray
}

const getMatchData = async (eventId, matchId) => {

  const eventName = await getEventDataById(2023, eventId)

  const formData = await FormDataSchema.find({
    eventName: eventName.name,
    matchNumber: matchId
  })
  return formData
}

const getEventSubmissionData = async (eventId, matchId, submissionId) => {
  const eventName = await getEventDataById(2023, eventId)

  const formData = await FormDataSchema.find({
    eventName: eventName.name,
    matchNumber: matchId
  })
  return formData[Number(submissionId) - 1]
}

const getAggregationData = async () => {
  const data = averageAggregation
  return data
}

const getAggregationSortedData = async (sortType, sortDirection) => {
  const data = FormDataSchema.aggregate(
    [{
      $addFields: {
        TotalScore: {
          $add: [{
            $multiply: [
              "$teleop.scored.cube.high",
              5,
            ],
          },
          {
            $multiply: [
              "$teleop.scored.cube.mid",
              3,
            ],
          },
          {
            $multiply: [
              "$teleop.scored.cube.low",
              2,
            ],
          },
          {
            $multiply: [
              "$teleop.scored.cone.high",
              5,
            ],
          },
          {
            $multiply: [
              "$teleop.scored.cone.mid",
              3,
            ],
          },
          {
            $multiply: [
              "$teleop.scored.cone.low",
              2,
            ],
          },
          {
            $multiply: [{
              $cond: {
                if: "$endgameDocked",
                then: 1,
                else: 0,
              },
            },
              6,
            ],
          },
          {
            $multiply: [{
              $cond: {
                if: "$endgameEngaged",
                then: 1,
                else: 0,
              },
            },
              4,
            ],
          },
          {
            $multiply: [{
              $cond: {
                if: "$autoDocked",
                then: 1,
                else: 0,
              },
            },
              8,
            ],
          },
          {
            $multiply: [{
              $cond: {
                if: "$autoEngaged",
                then: 1,
                else: 0,
              },
            },
              4,
            ],
          },
          ],
        },
        Telescore: {
          $add: [{
            $multiply: [
              "$teleop.scored.cube.high",
              5,
            ],
          },
          {
            $multiply: [
              "$teleop.scored.cube.mid",
              3,
            ],
          },
          {
            $multiply: [
              "$teleop.scored.cube.low",
              2,
            ],
          },
          {
            $multiply: [
              "$teleop.scored.cone.high",
              5,
            ],
          },
          {
            $multiply: [
              "$teleop.scored.cone.mid",
              3,
            ],
          },
          {
            $multiply: [
              "$teleop.scored.cone.low",
              2,
            ],
          },
          ],
        },
        Autoscore: {
          $add: [{
            $cond: {
              if: "$autoTaxi",
              then: 1,
              else: 0,
            },
          },
          {
            $cond: {
              if: "$autoEngaged",
              then: 4,
              else: 0,
            },
          },
          {
            $cond: {
              if: "$autoDocked",
              then: 8,
              else: 0,
            },
          },
          {
            $cond: {
              if: {
                autoScoreLevel: 3,
              },
              then: 6,
              else: 0,
            },
          },
          {
            $cond: {
              if: {
                autoScoreLevel: 2,
              },
              then: 4,
              else: 0,
            },
          },
          {
            $cond: {
              if: {
                autoScoreLevel: 1,
              },
              then: 3,
              else: 0,
            },
          },
          ],
        },
        AutoWeight: {
          $add: [{
            $cond: {
              if: "$autoTaxi",
              then: 1,
              else: 0,
            },
          },
          {
            $cond: {
              if: "$autoEngaged",
              then: 2,
              else: 0,
            },
          },
          {
            $cond: {
              if: "$autoDocked",
              then: 4,
              else: 0,
            },
          },
          {
            $cond: {
              if: {
                autoScoreLevel: 3,
              },
              then: 3,
              else: 0,
            },
          },
          {
            $cond: {
              if: {
                autoScoreLevel: 2,
              },
              then: 3,
              else: 0,
            },
          },
          {
            $cond: {
              if: {
                autoScoreLevel: 1,
              },
              then: 2,
              else: 0,
            },
          },
          ],
        },
        TeleopWeight: {
          $add: [{
            $cond: [{
              $gte: [{
                $sum: [
                  "$teleop.scored.cone.low",
                  "$teleop.scored.cube.low",
                ],
              },
                1,
              ],
            },
              1,
              0,
            ],
          },
          {
            $cond: [{
              $gte: [{
                $sum: [
                  "$teleop.scored.cone.mid",
                  "$teleop.scored.cube.mid",
                ],
              },
                1,
              ],
            },
              3,
              0,
            ],
          },
          {
            $cond: [{
              $gte: [{
                $sum: [
                  "$teleop.scored.cone.high",
                  "$teleop.scored.cube.high",
                ],
              },
                1,
              ],
            },
              4,
              0,
            ],
          },
          ],
        },
        EndgameWeight: {
          $add: [{
            $cond: {
              if: "$endgameDocked",
              then: 3,
              else: 0,
            },
          },
          {
            $cond: {
              if: "$endgameEngaged",
              then: 2,
              else: 0,
            },
          },
          ],
        },
        Defensive: {
          $cond: {
            if: "$defenceOrCycle",
            then: 1,
            else: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: "$teamNumber",
        AvgScore: {
          $avg: "$TotalScore",
        },
        AvgAuto: {
          $avg: "$AutoWeight",
        },
        AvgEndgame: {
          $avg: "$EndgameWeight",
        },
        Matches: {
          $sum: 1,
        },
        AvgTeleop: {
          $sum: "$TeleopWeight",
        },
        AutoScore: {
          $sum: "$Autoscore",
        },
        TeleScore: {
          $sum: "$Telescore",
        },
        Defense: {
          $sum: "$Defensive",
        },
      },
    },
    {
      $project: {
        _id: 1,
        AvgAuto: {
          $round: ["$AvgAuto", 2],
        },
        AvgTeleop: {
          $round: ["$AvgTeleop", 2],
        },
        AvgEndgame: {
          $round: ["$AvgEndgame", 2],
        },
        AutoScore: {
          $round: ["$AutoScore", 2],
        },
        TeleScore: {
          $round: ["$TeleScore", 2],
        },
        AvgWeight: {
          $round: [{
            $sum: [
              "$AvgAuto",
              "$AvgTeleop",
              "$AvgEndgame",
            ],
          },
            2,
          ],
        },
        AvgScore: 1,
        Defense: {
          $cond: [{
            $gte: ["$Defense", 4],
          },
            1,
            0,
          ],
        },
      },
    },
    {
      $sort:
      /**
       * Provide any number of field/order pairs.
       */
      {
        [sortType]: Number(sortDirection),
      },
    },
    ]
  )
  return data
}

app.listen(process.env.PORT, () => {
  console.log(`App is now listening on port: ${process.env.PORT}`);
});

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded());

app.options("/api/v1/login", cors());
app.options("/api/v1/submitform", cors());
app.options("/api/v1/teams", cors());
app.post("/api/v1/login", function (req, res, next) {
  requestBody = req.body;

  if (requestBody.user == '7028' && requestBody.password == process.env.LOGIN_PASSWORD) {
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.json({
      token: token,
    });
  } else if (requestBody.user == '7028Admin' && requestBody.password == process.env.ADMIN_LOGIN_PASSWORD) {
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.json({
      token: token,
    });
  } else {
    res.status(403);
    res.send("Auth Denied");
  }
});

app.post("/api/v1/submitform", function (req, res, next) {
  requestBody = req.body;

  if (requestBody.token.replace('Bearer ', '') !== token) {
    res.status(403);
    return res.send("Auth Denied");
  }

  schemaSend(requestBody.data.data)
});

app.get("/api/v1/teams", async function (req, res, next) {
  const teams = await getTeams()
  res.status(200);
  res.send({
    teams: teams
  })
});

app.get("/api/v1/teamsInEvent/:event", async function (req, res, next) {
  var event = req.params.event
  if (event == 'testing') event = "Testing Event"
  if (event == 'week0') event = "Week 0 Event"
  const teams = await getTeamsInEvent(event)
  res.status(200);
  res.send({
    teams: teams
  })
});

app.get("/api/v1/team/:team/nickname", async function (req, res, next) {
  const teamNickname = await getTeamNickname(req.params.team)
  res.status(200);
  res.send(teamNickname)
});

app.get("/api/v1/team/:team/submissions", async function (req, res, next) {
  const teamSubmissions = await getForms(req.params.team)
  res.status(200);
  res.send(teamSubmissions)
});

app.get("/api/v1/team/:team/submissiondata", async function (req, res, next) {
  const teamSubmissionData = await getFormData(req.params.team)
  res.status(200);
  res.send(teamSubmissionData)
});

app.get("/api/v1/events/:team/:year", async function (req, res, next) {
  const eventData = await getEventData(req.params.team, req.params.year)
  res.status(200)
  res.send(eventData)
})

app.get("/api/v1/events/:team/:year/landing", async function (req, res, next) {
  const eventData = await getLandingEventData(req.params.team, req.params.year)
  res.status(200)
  res.send(eventData)
})

app.get("/api/v1/event/:year/:eventId", async function (req, res, next) {
  const eventData = await getEventDataById(req.params.year, req.params.eventId)
  res.status(200)
  res.send(eventData)
})

app.get("/api/v1/submissions", async function (req, res, next) {
  const formData = await getAllFormsHomePage()
  res.status(200)
  res.send(formData)
})

app.get("/api/v1/submissions/all", async function (req, res, next) {
  const formData = await getAllForms()
  res.status(200)
  res.send(formData)
})

app.get("/api/v1/eventmatches/:eventId", async function (req, res, next) {
  const eventMatches = await getEventMatchNumbers(req.params.eventId)
  res.status(200)
  res.send(eventMatches)
})

app.get("/api/v1/eventmatch/:eventId/:matchId", async function (req, res, next) {
  const matchData = await getMatchData(req.params.eventId, req.params.matchId)
  res.status(200)
  res.send(matchData)
})

app.get("/api/v1/eventmatch/:eventId/:matchId/:submissionId", async function (req, res, next) {
  const submissionData = await getEventSubmissionData(req.params.eventId, req.params.matchId, req.params.submissionId)
  res.status(200)
  res.send(submissionData)
})

app.get("/api/v1/aggregation/data", async function (req, res, next) {
  const aggregationData = await getAggregationData()
  res.status(200)
  res.send(aggregationData)
})

app.get("/api/v1/submissions/sort/:sortOption/:direction", async function (req, res, next) {
  const sortedData = await getAllFormsSorted(req.params.sortOption, req.params.direction)
  res.status(200)
  res.send(sortedData)
})

app.get("/api/v1/submission/id/:id", async function (req, res, next) {
  const submissionData = await getSubmissionById(req.params.id)
  res.status(200)
  res.send(submissionData)
})

app.get("/api/v1/teamsAdvanced", async function (req, res, next) {
  const teams = await getTeamsAdvanced()
  res.status(200);
  res.send({
    teams: teams
  })
});

app.get("/api/v1/teamsAdvancedInEvent/:event", async function (req, res, next) {
  const teams = await getTeamsInEventAdvanced(req.params.event)
  res.status(200);
  res.send({
    teams: teams
  })
});

app.get("/api/v1/aggregation/sort/:sortOption/:direction", async function (req, res, next) {
  const sortedData = await getAggregationSortedData(req.params.sortOption, req.params.direction)
  res.status(200)
  res.send(sortedData)
})

app.get("/api/v1/team/:team/avatar", async function (req, res, next) {
  const avatar = await getTeamAvatar(req.params.team)
  res.status(200)
  res.send(avatar)
})

app.get("/api/v1/teamsAvatars", async function (req, res, next) {
  const avatars = await getAllTeamAvatars()
  res.status(200)
  res.send(avatars)
})

app.get("/api/v1/admin/users", async function (req, res, next) {
  if (req.headers['authorization'].replace('Basic Bearer ', '') !== token) {
    res.status(403)
    return res.send("Access Denied")
  }
  const oldUsers = await UsersDataSchema.find({})
  res.status(200)
  res.send(oldUsers[0])
})

app.post("/api/v1/admin/users/save", async function (req, res, next) {
  requestBody = req.body;

  if (requestBody.token.replace('Bearer ', '') !== token) {
    res.status(403);
    return res.send("Auth Denied");
  }

  const oldUsers = await UsersDataSchema.find({})

  if (oldUsers.length === 0) {
    return userSchemaSend(requestBody.users)
  }

  await UsersDataSchema.findOneAndReplace({}, {
    users: requestBody.users
  })

  res.status(200)
  res.send("Users Saved!")
});

app.get("/api/v1/admin/eventLock", async function (req, res, next) {
  if (req.headers['authorization'].replace('Basic Bearer ', '') !== token) {
    res.status(403)
    return res.send("Access Denied")
  }
  const oldEvent = await EventLockSchema.find({})
  res.status(200)
  res.send(oldEvent[0])
})

app.post("/api/v1/admin/eventLock/save", async function (req, res, next) {
  requestBody = req.body;

  if (requestBody.token.replace('Bearer ', '') !== token) {
    res.status(403);
    return res.send("Auth Denied");
  }

  const oldEvent = await EventLockSchema.find({})

  if (oldEvent.length === 0) {
    return eventSchemaSend(requestBody.event)
  }

  await EventLockSchema.findOneAndReplace({}, {
    event: requestBody.event
  })

  res.status(200)
  res.send("Event Lock Saved!")
});

app.post("/api/v1/admin/form/delete", async function (req, res, next) {
  requestBody = req.body;

  if (requestBody.token.replace('Bearer ', '') !== token) {
    res.status(403);
    return res.send("Auth Denied");
  }

  try {
    await FormDataSchema.findOneAndDelete(
      { _id: requestBody.formId }
    )
    console.log("Deleted Form")
  } catch (err) {
    return console.log(err)
  }

  res.status(200)
  res.send("Successfully Deleted Form!")
});

app.get("/api/v1/util/tokenCheck", async function (req, res, next) {
  if (req.headers['authorization'].replace('Basic Bearer ', '') !== token) {
    res.status(403)
    return res.send("Access Denied")
  }
  res.status(200)
  res.send("Token Verified")
})

process.on('uncaughtException', (error) => {
  console.log("Error Occured")
  console.error(error)
})