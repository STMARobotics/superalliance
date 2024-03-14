const StandFormSchema = require("./StandFormSchema");

const StandFormAggregation = (eventId) => {
  let pipeline = [
    {
      $addFields: {
        totalScore: {
          $add: [
            {
              $multiply: ["$autoAmpsNotes", 2],
            },
            {
              $multiply: ["$autoSpeakersNotes", 5],
            },
            {
              $multiply: ["$teleAmpsNotes", 1],
            },
            {
              $multiply: ["$teleSpeakersNotes", 2],
            },
            {
              $multiply: ["$teleAmplifiedSpeakersNotes", 5],
            },
            {
              $multiply: ["$teleTrapsNotes", 5],
            },
            {
              $cond: {
                if: "$leave",
                then: 2,
                else: 0,
              },
            },
            {
              $cond: {
                if: "$park",
                then: 1,
                else: 0,
              },
            },
            {
              $cond: {
                if: "$onstage",
                then: 3,
                else: 0,
              },
            },
            {
              $cond: {
                if: "$onstageSpotlit",
                then: 4,
                else: 0,
              },
            },
            {
              $cond: {
                if: "$harmony",
                then: 2,
                else: 0,
              },
            },
          ],
        },
        autoScore: {
          $add: [
            {
              $multiply: ["$autoAmpsNotes", 2],
            },
            {
              $multiply: ["$autoSpeakersNotes", 5],
            },
            {
              $cond: {
                if: "$leave",
                then: 2,
                else: 0,
              },
            },
          ],
        },
        teleScore: {
          $add: [
            {
              $multiply: ["$teleAmpsNotes", 1],
            },
            {
              $multiply: ["$teleSpeakersNotes", 2],
            },
            {
              $multiply: ["$teleAmplifiedSpeakersNotes", 5],
            },
            {
              $multiply: ["$teleTrapsNotes", 5],
            },
            {
              $cond: {
                if: "$park",
                then: 1,
                else: 0,
              },
            },
            {
              $cond: {
                if: "$onstage",
                then: 3,
                else: 0,
              },
            },
            {
              $cond: {
                if: "$onstageSpotlit",
                then: 4,
                else: 0,
              },
            },
            {
              $cond: {
                if: "$harmony",
                then: 2,
                else: 0,
              },
            },
          ],
        },
        totalNotes: {
          $add: [
            "$autoAmpsNotes",
            "$autoSpeakersNotes",
            "$teleAmpsNotes",
            "$teleSpeakersNotes",
            "$teleAmplifiedSpeakersNotes",
            "$teleTrapsNotes",
          ],
        },
        totalAutoNotes: {
          $add: ["$autoAmpsNotes", "$autoSpeakersNotes"],
        },
        totalTeleNotes: {
          $add: [
            "$teleAmpsNotes",
            "$teleSpeakersNotes",
            "$teleAmplifiedSpeakersNotes",
            "$teleTrapsNotes",
          ],
        },
        leaveBoolean: {
          $cond: {
            if: "$leave",
            then: 1,
            else: 0,
          },
        },
        parkBoolean: {
          $cond: {
            if: "$park",
            then: 1,
            else: 0,
          },
        },
        onstageBoolean: {
          $cond: {
            if: "$onstage",
            then: 1,
            else: 0,
          },
        },
        onstageSpotlitBoolean: {
          $cond: {
            if: "$onstageSpotlit",
            then: 1,
            else: 0,
          },
        },
        harmonyBoolean: {
          $cond: {
            if: "$harmony",
            then: 1,
            else: 0,
          },
        },
        selfSpotlitBoolean: {
          $cond: {
            if: "$selfSpotlight",
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
        stockpileBoolean: {
          $cond: {
            if: "$stockpile",
            then: 1,
            else: 0,
          },
        },
        underStageBoolean: {
          $cond: {
            if: "$underStage",
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
          totalNotes: {
            $sum: "$totalNotes",
          },
          totalAutoNotes: {
            $sum: "$totalAutoNotes",
          },
          totalTeleNotes: {
            $sum: "$totalTeleNotes",
          },
          matchTotalNotes: {
            $push: {
              $cond: [
                { $ne: ["$totalNotes", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalNotes",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchAutoNotes: {
            $push: {
              $cond: [
                { $ne: ["$autoNotes", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalAutoNotes",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchTeleNotes: {
            $push: {
              $cond: [
                { $ne: ["$teleNotes", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalTeleNotes",
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
          autoMiddleNotes: {
            $push: {
              $cond: [
                { $ne: ["$autoMiddleNotes", []] },
                {
                  matchNumber: "$matchNumber",
                  autoMiddleNotes: "$autoMiddleNotes",
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
          avgTotalNotes: {
            $avg: "$totalNotes",
          },
          avgAutoNotes: {
            $avg: "$totalAutoNotes",
          },
          avgTeleNotes: {
            $avg: "$totalTeleNotes",
          },
          avgAutoAmpsNotes: {
            $avg: "$autoAmpsNotes",
          },
          avgAutoSpeakersNotes: {
            $avg: "$autoSpeakersNotes",
          },
          avgTeleAmpsNotes: {
            $avg: "$teleAmpsNotes",
          },
          avgTeleSpeakersNotes: {
            $avg: "$teleSpeakersNotes",
          },
          avgTeleAmplifiedSpeakersNotes: {
            $avg: "$teleAmplifiedSpeakersNotes",
          },
          avgTeleTrapsNotes: {
            $avg: "$teleTrapsNotes",
          },
          leavePercentage: {
            $avg: "$leaveBoolean",
          },
          parkPercentage: {
            $avg: "$parkBoolean",
          },
          onstagePercentage: {
            $avg: "$onstageBoolean",
          },
          onstageSpotlitPercentage: {
            $avg: "$onstageSpotlitBoolean",
          },
          harmonyPercentage: {
            $avg: "$harmonyBoolean",
          },
          selfSpotlitPercentage: {
            $avg: "$selfSpotlitBoolean",
          },
          defensePercentage: {
            $avg: "$defenseBoolean",
          },
          defendedAgainstPercentage: {
            $avg: "$defendedAgainstBoolean",
          },
          stockpilePercentage: {
            $avg: "$stockpileBoolean",
          },
          underStagePercentage: {
            $avg: "$underStageBoolean",
          },
          winPercentage: {
            $avg: "$winBoolean",
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
          totalNotes: { $round: ["$totalNotes", 2] },
          totalAutoNotes: { $round: ["$totalAutoNotes", 2] },
          totalTeleNotes: { $round: ["$totalTeleNotes", 2] },
          matchTotalNotes: {
            $concatArrays: "$matchTotalNotes",
          },
          matchAutoNotes: {
            $concatArrays: "$matchAutoNotes",
          },
          matchTeleNotes: {
            $concatArrays: "$matchTeleNotes",
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
          middleNotes: {
            $concatArrays: "$autoMiddleNotes",
          },
          avgTotalScore: { $round: ["$avgTotalScore", 2] },
          avgAutoScore: { $round: ["$avgAutoScore", 2] },
          avgTeleScore: { $round: ["$avgTeleScore", 2] },
          avgTotalNotes: { $round: ["$avgTotalNotes", 2] },
          avgAutoNotes: { $round: ["$avgAutoNotes", 2] },
          avgTeleNotes: { $round: ["$avgTeleNotes", 2] },
          avgAutoAmpsNotes: { $round: ["$avgAutoAmpsNotes", 2] },
          avgAutoSpeakersNotes: { $round: ["$avgAutoSpeakersNotes", 2] },
          avgTeleAmpsNotes: { $round: ["$avgTeleAmpsNotes", 2] },
          avgTeleSpeakersNotes: { $round: ["$avgTeleSpeakersNotes", 2] },
          avgTeleAmplifiedSpeakersNotes: {
            $round: ["$avgTeleAmplifiedSpeakersNotes", 2],
          },
          avgTeleTrapsNotes: { $round: ["$avgTeleTrapsNotes", 2] },
          leavePercentage: { $round: ["$leavePercentage", 2] },
          parkPercentage: { $round: ["$parkPercentage", 2] },
          onstagePercentage: { $round: ["$onstagePercentage", 2] },
          onstageSpotlitPercentage: {
            $round: ["$onstageSpotlitPercentage", 2],
          },
          harmonyPercentage: { $round: ["$harmonyPercentage", 2] },
          selfSpotlitPercentage: { $round: ["$selfSpotlitPercentage", 2] },
          defensePercentage: { $round: ["$defensePercentage", 2] },
          defendedAgainstPercentage: {
            $round: ["$defendedAgainstPercentage", 2],
          },
          stockpilePercentage: { $round: ["$stockpilePercentage", 2] },
          underStagePercentage: { $round: ["$underStagePercentage", 2] },
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
