const StandFormSchema = require("./StandFormSchema");

const StandFormAggregation = (eventId) => {
  let pipeline = [
    {
      $addFields: {
        totalScore: {
          $add: [
            {
              $multiply: ["$autoCoralL1", 3],
            },
            {
              $multiply: ["$autoCoralL2", 4],
            },
            {
              $multiply: ["$autoCoralL3", 6],
            },
            {
              $multiply: ["$autoCoralL4", 7],
            },
            {
              $multiply: ["$autoAlgaeProcessor", 6],
            },
            {
              $multiply: ["$autoAlgaeNet", 4],
            },
            {
              $multiply: ["$teleopCoralL1", 2],
            },
            {
              $multiply: ["$teleopCoralL2", 3],
            },
            {
              $multiply: ["$teleopCoralL3", 4],
            },
            {
              $multiply: ["$teleopCoralL4", 5],
            },
            {
              $multiply: ["$teleopAlgaeProcessor", 6],
            },
            {
              $multiply: ["$teleopAlgaeNet", 4],
            },
            {
              $cond: {
                if: "$park",
                then: 2,
                else: 0,
              },
            },
            {
              $cond: {
                if: "$shallowClimb",
                then: 6,
                else: 0,
              },
            },
            {
              $cond: {
                if: "$deepClimb",
                then: 12,
                else: 0,
              },
            },
          ],
        },
        autoScore: {
          $add: [
            {
              $multiply: ["$autoCoralL1", 3],
            },
            {
              $multiply: ["$autoCoralL2", 4],
            },
            {
              $multiply: ["$autoCoralL3", 6],
            },
            {
              $multiply: ["$autoCoralL4", 7],
            },
            {
              $multiply: ["$autoAlgaeProcessor", 6],
            },
            {
              $multiply: ["$autoAlgaeNet", 4],
            },
          ],
        },
        teleScore: {
          $add: [
            {
              $multiply: ["$teleopCoralL1", 2],
            },
            {
              $multiply: ["$teleopCoralL2", 3],
            },
            {
              $multiply: ["$teleopCoralL3", 4],
            },
            {
              $multiply: ["$teleopCoralL4", 5],
            },
            {
              $multiply: ["$teleopAlgaeProcessor", 6],
            },
            {
              $multiply: ["$teleopAlgaeNet", 4],
            },
            {
              $cond: {
                if: "$park",
                then: 2,
                else: 0,
              },
            },
            {
              $cond: {
                if: "$shallowClimb",
                then: 6,
                else: 0,
              },
            },
            {
              $cond: {
                if: "$deepClimb",
                then: 12,
                else: 0,
              },
            },
          ],
        },
        totalCoral: {
          $add: [
            "$autoCoralL1",
            "$autoCoralL2",
            "$autoCoralL3",
            "$autoCoralL4",
            "$teleopCoralL1",
            "$teleopCoralL2",
            "$teleopCoralL3",
            "$teleopCoralL4",
          ],
        },
        totalAutoCoral: {
          $add: ["$autoCoralL1",
            "$autoCoralL2",
            "$autoCoralL3",
            "$autoCoralL4",],
        },
        totalTeleCoral: {
          $add: [
            "$teleopCoralL1",
            "$teleopCoralL2",
            "$teleopCoralL3",
            "$teleopCoralL4",
          ],
        },
        totalAlgae : {
          $add: ["$autoAlgaeProcessor",
                 "$autoAlgaeNet", 
                 "$teleopAlgaeProcessor", 
                 "$teleopAlgaeNet"
              ],
        },
        totalProcessedAlgae : {
          $add: ["$autoAlgaeProcessor", 
                 "$teleopAlgaeProcessor"
              ],
        },
        totalNetAlgae : {
          $add: ["$autoAlgaeNet", 
                 "$teleopAlgaeNet"
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
        shallowClimbBoolean: {
          $cond: {
            if: "$shallowClimb",
            then: 1,
            else: 0,
          },
        },
        deepClimbBoolean: {
          $cond: {
            if: "$deepClimb",
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
          totalCoral: {
            $sum: "$totalCoral",
          },
          totalAutoCoral: {
            $sum: "$totalAutoCoral",
          },
          totalTeleCoral: {
            $sum: "$totalTeleCoral",
          },
          totalAlgae: {
            $sum: "$totalAlgae",
          },
          totalProcessedAlgae: {
            $sum: "$totalProcessedAlgae",
          },
          totalNetAlgae: {
            $sum: "$totalNetAlgae",
          },
          matchTotalCoral: {
            $push: {
              $cond: [
                { $ne: ["$totalCoral", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalCoral",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchAutoCoral: {
            $push: {
              $cond: [
                { $ne: ["$autoCoral", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalAutoCoral",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchTeleCoral: {
            $push: {
              $cond: [
                { $ne: ["$teleNotes", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalTeleCoral",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchTotalAlgae: {
            $push: {
              $cond: [
                { $ne: ["$totalAlgae", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalAlgae",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchProcessedAlgae: {
            $push: {
              $cond: [
                { $ne: ["$autoAlgae", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalProcessedAlgae",
                  formId: "$_id",
                },
                "$$REMOVE",
              ],
            },
          },
          matchNetAlgae: {
            $push: {
              $cond: [
                { $ne: ["$teleAlgae", 0] },
                {
                  matchNumber: "$matchNumber",
                  score: "$totalNetAlgae",
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
          avgTotalCoral: {
            $avg: "$totalCoral",
          },
          avgAutoCoral: {
            $avg: "$totalAutoCoral",
          },
          avgTeleCoral: {
            $avg: "$totalTeleCoral",
          },
          avgTotalAlgae: {
            $avg: "$totalAlgae",
          },
          avgProcessedAlgae: {
            $avg: "$totalProcessedAlgae",
          },
          avgNetAlgae: {
            $avg: "$totalNetAlgae",
          },
          leavePercentage: {
            $avg:  { $multiply: ["$leaveBoolean", 100]},
          },
          parkPercentage: {
            $avg:  { $multiply: ["$parkBoolean", 100]},
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
          totalCoral: { $round: ["$totalCoral", 2] },
          totalAutoCoral: { $round: ["$totalAutoCoral", 2] },
          totalTeleCoral: { $round: ["$totalTeleCoral", 2] },
          totalAlgae: { $round: ["$totalAlgae", 2] },
          totalProcessedAlgae: { $round: ["$totalProcessedAlgae", 2] },
          totalNetAlgae: { $round: ["$totalNetAlgae", 2] },
          matchTotalCoral: {
            $concatArrays: "$matchTotalCoral",
          },
          matchAutoCoral: {
            $concatArrays: "$matchAutoCoral",
          },
          matchTeleCoral: {
            $concatArrays: "$matchTeleCoral",
          },
          matchTotalAlgae: { 
            $concatArrays: "$matchTotalAlgae" 
          },
          matchProcessedAlgae: {
            $concatArrays: "$matchProcessedAlgae",
          },
          matchNetAlgae: {
            $concatArrays: "$matchNetAlgae",
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
          avgTotalCoral: { $round: ["$avgTotalCoral", 2] },
          avgAutoCoral: { $round: ["$avgAutoCoral", 2] },
          avgTeleCoral: { $round: ["$avgTeleCoral", 2] },
          avgTotalAlgae: { $round: ["$avgTotalAlgae", 2] },
          avgProcessedAlgae: { $round: ["$avgProcessedAlgae", 2] },
          avgNetAlgae: { $round: ["$avgNetAlgae", 2] },
          leavePercentage: { $round: ["$leavePercentage", 2] },
          parkPercentage: { $round: ["$parkPercentage", 2] },
          shallowClimbPercentage: {
            $round: ["$shallowClimbPercentage", 2],
          },
          deepClimbPercentage: { $round: ["$deepClimbPercentage", 2] },
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
