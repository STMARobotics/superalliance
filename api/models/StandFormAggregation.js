const StandFormSchema = require("./StandFormSchema");

const StandFormAggregation = (eventId) => {
  let pipeline = [
    {
      $addFields: {
        totalScore: {
          $add: [
            {
              $multiply: ["$autoFuel", 1],
            },
            {
              $multiply: ["$teleFuel", 1],
            },
            {
              $cond: {
                if: "$autoClimb",
                then: 15,
                else: 0,
              },
            },
            {
              $cond: {
                if: { $or: ["$centerClimbLevelOne", "$sideClimbLevelOne"] },
                then: 10,
                else: 0,
              },
            },
            {
              $cond: {
                if: { $or: ["$centerClimbLevelTwo", "$sideClimbLevelTwo"] },
                then: 20,
                else: 0,
              },
            },
            {
              $cond: {
                if: { $or: ["$centerClimbLevelThree", "$sideClimbLevelThree"] },
                then: 30,
                else: 0,
              },
            },
          ],
        },
        autoScore: {
          $add: [
            {
              $multiply: ["$autoFuel", 1],
            },
            {
              $cond: {
                if: "$autoClimb",
                then: 15,
                else: 0,
              },
            },
          ],
        },
        teleScore: {
          $add: [
            {
              $multiply: ["$teleFuel", 1],
            },
            {
              $cond: {
                if: { $or: ["$leftClimbLevelOne", "$centerClimbLevelOne", "$rightClimbLevelOne"] },
                then: 10,
                else: 0,
              },
            },
            {
              $cond: {
                if: { $or: ["$leftClimbLevelTwo", "$centerClimbLevelTwo", "$rightClimbLevelTwo"] },
                then: 20,
                else: 0,
              },
            },
            {
              $cond: {
                if: { $or: ["$leftClimbLevelThree", "$centerClimbLevelThree", "$rightClimbLevelThree"] },
                then: 30,
                else: 0,
              },
            },
          ],
        },
        totalFuel: {
          $add: [
            "$autoFuel",
            "$teleFuel",
          ],
        },
        totalAutoFuel: {
          $add: "$autoFuel",
        },
        totalTeleFuel: {
          $add: "$teleFuel",
        },
        accuracy: {
          $divide: [
            "$teleFuel",
            { $add: ["$teleFuel", "$shotsMissed"] }
          ]
        },
        autoBoolean: {
          $cond: {
            if: "$auto",
            then: 1,
            else: 0,
          },
        },
        defenseBoolean: {
          $cond: {
            if: "$defense",
            then: 1,
            else: 0,
          },
        },
        defendedAgainstBoolean: {
          $cond: {
            if: "$defendedAgainst",
            then: 1,
            else: 0,
          },
        },
        shuttleBoolean: {
          $cond: {
            if: "$shuttle",
            then: 1,
            else: 0,
          },
        },
        moveWhileShootBoolean: {
          $cond: {
            if: "$moveWhileShoot",
            then: 1,
            else: 0,
          },
        },
        bumpBoolean: {
          $cond: {
            if: "$bump",
            then: 1,
            else: 0,
          },
        },
        trenchBoolean: {
          $cond: {
            if: "$trench",
            then: 1,
            else: 0,
          },
        },
        centerClimbLevelOneBoolean: {
          $cond: {
            if: "$centerClimbLevelOne",
            then: 1,
            else: 0,
          },
        },
        sideClimbLevelOneBoolean: {
          $cond: {
            if: "$sideClimbLevelOne",
            then: 1,
            else: 0,
          },
        },
        centerClimbLevelTwoBoolean: {
          $cond: {
            if: "$centerClimbLevelTwo",
            then: 1,
            else: 0,
          },
        },
        sideClimbLevelTwoBoolean: {
          $cond: {
            if: "$sideClimbLevelTwo",
            then: 1,
            else: 0,
          },
        },
        centerClimbLevelThreeBoolean: {
          $cond: {
            if: "$centerClimbLevelThree",
            then: 1,
            else: 0,
          },
        },
        sideClimbLevelThreeBoolean: {
          $cond: {
            if: "$sideClimbLevelThree",
            then: 1,
            else: 0,
          },
        },
        winBoolean: {
          $cond: {
            if: "$win",
            then: 1,
            else: 0,
          },
        },
        criticalCount: {
          $size: "$criticals",
        },
      },
    },
    {
      $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
          _id: "$teamNumber",
          totalScore: {
            $sum: "$totalScore",
          },
          totalAutoScore: {
            $sum: "$autoScore",
          },
          totalTeleScore: {
            $sum: "$teleScore",
          },
          totalFuel: {
            $sum: "$totalFuel",
          },
          totalAutoFuel: {
            $sum: "$totalAutoFuel",
          },
          totalTeleFuel: {
            $sum: "$totalTeleFuel",
          },
          matchTotalFuel: {
            $push: {
              $cond: [
                { $ne: ["$totalFuel", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalFuel",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchAutoFuel: {
            $push: {
              $cond: [
                { $ne: ["$autoFuel", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalAutoFuel",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchTeleFuel: {
            $push: {
              $cond: [
                { $ne: ["$teleFuel", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalTeleFuel",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchTotalScores: {
            $push: {
              $cond: [
                { $ne: ["$totalScore", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalScore",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchAutoScores: {
            $push: {
              $cond: [
                { $ne: ["$autoScore", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$autoScore",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchTeleScores: {
            $push: {
              $cond: [
                { $ne: ["$teleScore", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$teleScore",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchRP: {
            $push: {
              $cond: [
                { $ne: ["$rpEarned", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$rpEarned",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          avgTotalScore: {
            $avg: "$totalScore",
          },
          avgAutoScore: {
            $avg: "$autoScore",
          },
          avgTeleScore: {
            $avg: "$teleScore",
          },
          avgTotalFuel: {
            $avg: "$totalFuel",
          },
          avgAutoFuel: {
            $avg: "$totalAutoFuel",
          },
          avgTeleFuel: {
            $avg: "$totalTeleFuel",
          },
          avgAccuracy: {
            $avg: "accuracy",
          },
          autoPercentage: {
            $avg:  { $multiply: ["$autoBoolean", 100]},
          },
          bumpPercentage: {
            $avg:  { $multiply: ["$bumpBoolean", 100]},
          },
          trenchPercentage: {
            $avg:  { $multiply: ["$trenchBoolean", 100]},
          },
          leftClimbLevelOnePercentage: {
            $avg:  { $multiply: ["$leftClimbLevelOneBoolean", 100]},
          },
          centerClimbLevelOnePercentage: {
            $avg:  { $multiply: ["$centerClimbLevelOneBoolean", 100]},
          },
          rightClimbLevelOnePercentage: {
            $avg:  { $multiply: ["$rightClimbLevelOneBoolean", 100]},
          },
          leftClimbLevelTwoPercentage: {
            $avg:  { $multiply: ["$leftClimbLevelTwoBoolean", 100]},
          },
          centerClimbLevelTwoPercentage: {
            $avg:  { $multiply: ["$centerClimbLevelTwoBoolean", 100]},
          },
          rightClimbLevelTwoPercentage: {
            $avg:  { $multiply: ["$rightClimbLevelTwoBoolean", 100]},
          },
          leftClimbLevelThreePercentage: {
            $avg:  { $multiply: ["$leftClimbLevelThreeBoolean", 100]},
          },
          centerClimbLevelThreePercentage: {
            $avg:  { $multiply: ["$centerClimbLevelThreeBoolean", 100]},
          },
          rightClimbLevelThreePercentage: {
            $avg:  { $multiply: ["$rightClimbLevelThreeBoolean", 100]},
          },
          shuttlePercentage: {
            $avg:  { $multiply: ["$shuttleBoolean", 100]},
          },
          moveWhileShootPercentage: {
            $avg:  { $multiply: ["$moveWhileShootBoolean", 100]},
          },
          defensePercentage: {
            $avg:  { $multiply: ["$defenseBoolean", 100]},
          },
          defendedAgainstPercentage: {
            $avg:  { $multiply: ["$defendedAgainstBoolean", 100]},
          },
          shallowClimbPercentage: {
            $avg:  { $multiply: ["$shallowClimbBoolean", 100]},
          },
          deepClimbPercentage: {
            $avg:  { $multiply: ["$deepClimbBoolean", 100]},
          },
          winPercentage: {
            $avg:  { $multiply: ["$winBoolean", 100]},
          },
          avgRP: {
            $avg: "$rpEarned",
          },
          criticals: {
            $push: {
              $cond: [
                { $ne: ["$criticals", []] },
                {
                  matchNumber: "$matchNumber",
                  criticals: "$criticals",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          comments: {
            $push: {
              $cond: [
                { $ne: ["$comments", ""] },
                {
                  matchNumber: "$matchNumber",
                  comments: "$comments",
                  formId: "$_id",
                  usersName: "$usersName",
                },
                "$$REMOVE",
              ],
            },
          },
          criticalCount: {
            $sum: "$criticalCount",
          },
          matchCount: {
            $sum: 1,
          },
        },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          teamNumber: 1,
          totalScore: { $round: ["$totalScore", 2] },
          totalAutoScore: { $round: ["$totalAutoScore", 2] },
          totalTeleScore: { $round: ["$totalTeleScore", 2] },
          totalFuel: { $round: ["$totalFuel", 2] },
          totalAutoFuel: { $round: ["$totalAutoFuel", 2] },
          totalTeleFuel: { $round: ["$totalTeleFuel", 2] },
          matchTotalFuel: {
            $concatArrays: "$matchTotalFuel",
          },
          matchAutoFuel: {
            $concatArrays: "$matchAutoFuel",
          },
          matchTeleFuel: {
            $concatArrays: "$matchTeleFuel",
          },
          matchTotalScore: {
            $concatArrays: "$matchTotalScores",
          },
          matchAutoScore: {
            $concatArrays: "$matchAutoScores",
          },
          matchTeleScore: {
            $concatArrays: "$matchTeleScores",
          },
          matchRP: {
            $concatArrays: "$matchRP",
          },
          avgTotalScore: { $round: ["$avgTotalScore", 2] },
          avgAutoScore: { $round: ["$avgAutoScore", 2] },
          avgTeleScore: { $round: ["$avgTeleScore", 2] },
          avgTotalFuel: { $round: ["$avgTotalFuel", 2] },
          avgAutoFuel: { $round: ["$avgAutoFuel", 2] },
          avgTeleFuel: { $round: ["$avgTeleFuel", 2] },
          avgAccuracy: { $round: ["$avgAccuracy", 2] },
          autoPercentage: { $round: ["$autoPercentage", 2] },
          bumpPercentage: { $round: ["$bumpPercentage", 2] },
          trenchPercentage: { $round: ["$trenchPercentage", 2] },
          leftClimbLevelOnePercentage: { $round: ["$leftClimbLevelOnePercentage", 2] },
          centerClimbLevelOnePercentage: { $round: ["$centerClimbLevelOnePercentage", 2] },
          rightClimbLevelOnePercentage: { $round: ["$rightClimbLevelOnePercentage", 2] },
          leftClimbLevelTwoPercentage: { $round: ["$leftClimbLevelTwoPercentage", 2] },
          centerClimbLevelTwoPercentage: { $round: ["$centerClimbLevelTwoPercentage", 2] },
          rightClimbLevelTwoPercentage: { $round: ["$rightClimbLevelTwoPercentage", 2] },
          leftClimbLevelThreePercentage: { $round: ["$leftClimbLevelThreePercentage", 2] },
          centerClimbLevelThreePercentage: { $round: ["$centerClimbLevelThreePercentage", 2] },
          rightClimbLevelThreePercentage: { $round: ["$rightClimbLevelThreePercentage", 2] },
          shuttlePercentage: { $round: ["$shuttlePercentage", 2] },
          moveWhileShootPercentage: { $round: ["$moveWhileShootPercentage", 2] },
          defensePercentage: { $round: ["$defensePercentage", 2] },
          defendedAgainstPercentage: {
            $round: ["$defendedAgainstPercentage", 2],
          },
          winPercentage: { $round: ["$winPercentage", 2] },
          avgRP: { $round: ["$avgRP", 2] },
          comments: {
            $concatArrays: "$comments",
          },
          criticals: {
            $concatArrays: "$criticals",
          },
          criticalCount: 1,
          matchCount: 1,
        },
    },
    {
      $sort:
        /**
         * Provide any number of field/order pairs.
         */
        {
          _id: 1,
        },
    },
  ];

  if (eventId) pipeline.unshift({ $match: { event: eventId } });

  return StandFormSchema.aggregate(pipeline);
};

module.exports = StandFormAggregation;
