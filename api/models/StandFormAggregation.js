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
              $multiply: ["$teleTrapsNotes", 2],
            },
            {
              $cond: {
                if: "$leave",
                then: 1,
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
                then: 1,
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
        autoscore: {
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
                then: 1,
                else: 0,
              },
            },
          ],
        },
        telescore: {
          $add: [
            {
              $multiply: ["$teleAmpsNotes", 1],
            },
            {
              $multiply: ["$teleSpeakersNotes", 2],
            },
          ],
        },
        onstageNumber: {
          $cond: {
            if: "$onstage",
            then: 1,
            else: 0,
          },
        },
        parkNumber: {
          $cond: {
            if: "$park",
            then: 1,
            else: 0,
          },
        },
        CritNumber: {
          $size: "$criticals",
        },
        StockpileNumber: {
          $cond: {
            if: "$stockpile",
            then: 1,
            else: 0,
          },
        },
        WinNumber: {
          $cond: {
            if: "$Win",
            then: 1,
            else: 0,
          },
        },
        SelfSpotlightNumber: {
          $cond: {
            if: "$selfSpotlight",
            then: 1,
            else: 0,
          },
        },
        DefenseNumber: {
          $cond: {
            if: "$defense",
            then: 1,
            else: 0,
          },
        },
        DefenseAgainstNumber: {
          $cond: {
            if: "$defendedAgainst",
            then: 1,
            else: 0,
          },
        },
        UnderStageNumber: {
          $cond: {
            if: "$underStage",
            then: 1,
            else: 0,
          },
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
            $sum: "$autoscore",
          },
          matchTeleScores: {
            $push: {
              $cond: [
                { $ne: ["$telescore", 0] },
                {
                  matchNumber: "$matchNumber",
                  teleScore: "$telescore",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchAutoScores: {
            $push: {
              $cond: [
                { $ne: ["$autoscore", 0] },
                {
                  matchNumber: "$matchNumber",
                  autoScore: "$autoscore",
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
                  totalScore: "$totalScore",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          avgScore: {
            $avg: "$totalScore",
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
          avgAutoAmp: {
            $avg: "$autoAmpsNotes",
          },
          avgAutoSpeaker: {
            $avg: "$autoSpeakersNotes",
          },
          avgTeleAmp: {
            $avg: "$teleAmpsNotes",
          },
          avgTeleSpeaker: {
            $avg: "$teleSpeakersNotes",
          },
          onstagePCT: {
            $avg: "$onstageNumber",
          },
          avgRP: {
            $avg: "$rpEarned",
          },
          parkPCT: {
            $avg: "$parkNumber",
          },
          TotalCrits: {
            $sum: "$CritNumber",
          },
          Criticals: {
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
          Comments: {
            $push: {
              $cond: [{ $ne: ["$comments", ""] }, "$comments", "$$REMOVE"],
            },
          },
          StockpilePCT: {
            $avg: "$StockpileNumber",
          },
          WinPCT: {
            $avg: "$WinNumber",
          },
          Matches: {
            $sum: 1,
          },
          AVGAutoScore: {
            $avg: "$autoscore",
          },
          AVGTeleScore: {
            $avg: "$telescore",
          },
          SelfSpotlightPCT: {
            $avg: "$SelfSpotlightNumber",
          },
          DefensePCT: {
            $avg: "$DefenseNumber",
          },
          DefenseAgainstPCT: {
            $avg: "$DefenseAgainstNumber",
          },
          AvgTimesAmped: {
            $avg: "$timesAmpedUsed",
          },
          AvgTrapNotes: {
            $avg: "$teleTrapsNotes",
          },
          AvgUnderStage: {
            $avg: "$UnderStageNumber",
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
          TeamNumber: 1,
          totalScore: { $round: ["$totalScore", 2] },
          totalAutoScore: { $round: ["$totalAutoScore", 2] },
          matchAutoScore: {
            $concatArrays: "$matchAutoScores",
          },
          matchTeleScore: {
            $concatArrays: "$matchTeleScores",
          },
          matchTotalScore: {
            $concatArrays: "$matchTotalScores",
          },
          avgScore: { $round: ["$avgScore", 2] },
          middleNotes: {
            $concatArrays: "$autoMiddleNotes",
          },
          avgAutoAmp: { $round: ["$avgAutoAmp", 2] },
          avgAutoSpeaker: { $round: ["$avgAutoSpeaker", 2] },
          avgTeleAmp: { $round: ["$avgTeleAmp", 2] },
          avgTeleSpeaker: { $round: ["$avgTeleSpeaker", 2] },
          onstagePCT: { $round: ["$onstagePCT", 2] },
          avgRP: { $round: ["$avgRP", 2] },
          parkPCT: { $round: ["$parkPCT", 2] },
          TotalCrits: 1,
          Comments: {
            $concatArrays: "$Comments",
          },
          Criticals: {
            $concatArrays: "$Criticals",
          },
          StockpilePCT: { $round: ["$StockpilePCT", 2] },
          WinPCT: { $round: ["$WinPCT", 2] },
          Matches: 1,
          AVGAutoScore: { $round: ["$AVGAutoScore", 2] },
          AVGTeleScore: { $round: ["$AVGTeleScore", 2] },
          SelfSpotlightPCT: { $round: ["$SelfSpotlightPCT", 2] },
          DefensePCT: { $round: ["$DefensePCT", 2] },
          DefenseAgainstPCT: { $round: ["$DefenseAgainstPCT", 2] },
          AvgTimesAmped: { $round: ["$AvgTimesAmped", 2] },
          AvgTrapNotes: { $round: ["$AvgTrapNotes", 2] },
          AvgUnderStage: { $round: ["$AvgUnderStage", 2] },
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
