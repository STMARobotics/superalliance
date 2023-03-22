const FormDataSchema = require('../Schemas/FormDataSchema')

const averageSortedAggregationEvent = (selectedEventName, sortType, sortDirection) => {
  return FormDataSchema.aggregate(
    [
      {
        $addFields: {
          TotalScore: {
            $add: [
              {
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
                $cond: {
                  if: "$endgameDocked",
                  then: 6,
                  else: 0,
                },
              },
              {
                $multiply: [
                  "$autoExtraPiece.scored.mid",
                  4,
                ],
              },
              {
                $multiply: [
                  "$autoExtraPiece.scored.high",
                  3,
                ],
              },
              {
                $multiply: [
                  "$autoExtraPiece.scored.low",
                  6,
                ],
              },
              {
                $cond: {
                  if: "$endgameEngaged",
                  then: 10,
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
                  if: "$autoEngaged",
                  then: 12,
                  else: 0,
                },
              },
              {
                $cond: {
                  if: "$autoTaxi",
                  then: 3,
                  else: 0,
                },
              },
            ],
          },
          Telescore: {
            $add: [
              {
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
            $add: [
              {
                $multiply: [
                  "$autoExtraPiece.scored.mid",
                  4,
                ],
              },
              {
                $multiply: [
                  "$autoExtraPiece.scored.high",
                  3,
                ],
              },
              {
                $multiply: [
                  "$autoExtraPiece.scored.low",
                  6,
                ],
              },
              {
                $cond: {
                  if: "$autoTaxi",
                  then: 3,
                  else: 0,
                },
              },
              {
                $cond: {
                  if: "$autoEngaged",
                  then: 12,
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
            ],
          },
          AutoWeight: {
            $add: [
              {
                $cond: {
                  if: "$autoTaxi",
                  then: 1,
                  else: 0,
                },
              },
              {
                $cond: {
                  if: "$autoEngaged",
                  then: 6,
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
            ],
          },
          TeleopWeight: {
            $add: [
              {
                $cond: [
                  {
                    $gte: [
                      {
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
                $cond: [
                  {
                    $gte: [
                      {
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
                $cond: [
                  {
                    $gte: [
                      {
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
            $add: [
              {
                $cond: {
                  if: "$endgameDocked",
                  then: 3,
                  else: 0,
                },
              },
              {
                $cond: {
                  if: "$endgameEngaged",
                  then: 5,
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
          Critical: {
            $cond: {
              if: {
                $isArray: "$criticals",
              },
              then: {
                $size: "$criticals",
              },
              else: "NA",
            },
          },
          Cubes: {
            $add: [
              "$teleop.scored.cube.low",
              "$teleop.scored.cube.mid",
              "$teleop.scored.cube.high",
            ],
          },
          Cones: {
            $add: [
              "$teleop.scored.cone.low",
              "$teleop.scored.cone.mid",
              "$teleop.scored.cone.high",
            ],
          },
          SinglePlayer: {
            $cond: {
              if: {
                $eq: ["$humanPlayerStation", 1],
              },
              then: 1,
              else: 0,
            },
          },
          DoublePlayer: {
            $cond: {
              if: {
                $eq: ["$humanPlayerStation", 2],
              },
              then: 1,
              else: 0,
            },
          },
          BothPlayer: {
            $cond: {
              if: {
                $eq: ["$humanPlayerStation", 3],
              },
              then: 1,
              else: 0,
            },
          },
          TippedCones: {
            $cond: {
              if: {
                $eq: ["$pickUpTippedCones", 1],
              },
              then: 1,
              else: 0,
            },
          },
          FloorCones: {
            $cond: {
              if: {
                $eq: ["$pickUpFloorCones", 1],
              },
              then: 1,
              else: 0,
            },
          },
        },
      },
      {
        $match:
        /**
         * query: The query in MQL.
         */
        {
          eventName:
            selectedEventName,
        },
      },
      {
        $group: {
          _id: "$teamNumber",
          AvgScore: {
            $avg: "$TotalScore",
          },
          PickUpTippedCone: {
            $sum: "$TippedCones",
          },
          PickUpFloorCone: {
            $sum: "$FloorCones",
          },
          AvgPickUpTippedCone: {
            $avg: "$TippedCones",
          },
          AvgPickUpFloorCone: {
            $avg: "$FloorCones",
          },
          AvgAuto: {
            $avg: "$AutoWeight",
          },
          AvgEndgame: {
            $avg: "$EndgameWeight",
          },
          AvgSinglePlayer: {
            $avg: "$SinglePlayer",
          },
          AvgDoublePlayer: {
            $avg: "$DoublePlayer",
          },
          AvgBothPlayer: {
            $avg: "$BothPlayer",
          },
          BestAuto: {
            $max: "$Autoscore",
          },
          BestTele: {
            $max: "$Telescore",
          },
          AvgCone: {
            $avg: "$Cones",
          },
          AvgCube: {
            $avg: "$Cubes",
          },
          TotalCrit: {
            $sum: "$Critical",
          },
          Matches: {
            $sum: 1,
          },
          AvgHighCube: {
            $avg: "$teleop.scored.cube.high",
          },
          AvgHighCone: {
            $avg: "$teleop.scored.cone.high",
          },
          AvgMidCube: {
            $avg: "$teleop.scored.cube.mid",
          },
          AvgMidCone: {
            $avg: "$teleop.scored.cone.mid",
          },
          AvgLowCube: {
            $avg: "$teleop.scored.cube.low",
          },
          AvgLowCone: {
            $avg: "$teleop.scored.cone.low",
          },
          AvgTeleop: {
            $avg: "$TeleopWeight",
          },
          AvgAutoScore: {
            $avg: "$Autoscore",
          },
          AvgTeleScore: {
            $avg: "$Telescore",
          },
          Defense: {
            $avg: "$Defensive",
          },
          Ranking: {
            $avg: "$rankPointsEarned",
          },
        },
      },
      {
        $project: {
          _id: 1,
          AvgAuto: {
            $round: ["$AvgAuto", 2],
          },
          FloorCone: {
            $cond: [
              {
                $gte: ["$PickUpFloorCone", 2],
              },
              true,
              false,
            ],
          },
          TipCone: {
            $cond: [
              {
                $gte: ["$PickUpTippedCone", 2],
              },
              true,
              false,
            ],
          },
          TotalCrit: 1,
          AvgTippedCone: {
            $round: ["$AvgPickUpTippedCone", 2],
          },
          AvgFloorCone: {
            $round: ["$AvgPickUpFloorCone", 2],
          },
          AvgTeleop: {
            $round: ["$AvgTeleop", 2],
          },
          AvgCones: {
            $round: ["$AvgCone", 2],
          },
          AvgCubes: {
            $round: ["$AvgCube", 2],
          },
          AvgEndgame: {
            $round: ["$AvgEndgame", 2],
          },
          AvgSinglePlayer: {
            $round: ["$AvgSinglePlayer", 2],
          },
          AvgDoublePlayer: {
            $round: ["$AvgDoublePlayer", 2],
          },
          AvgBothPlayer: {
            $round: ["$AvgBothPlayer", 2],
          },
          AvgAutoScore: {
            $round: ["$AvgAutoScore", 2],
          },
          AvgTeleScore: {
            $round: ["$AvgTeleScore", 2],
          },
          Matches: 1,
          AvgHighCube: {
            $round: ["$AvgHighCube", 2],
          },
          AvgHighCone: {
            $round: ["$AvgHighCone", 2],
          },
          AvgMidCube: {
            $round: ["$AvgMidCube", 2],
          },
          AvgMidCone: {
            $round: ["$AvgHighCube", 2],
          },
          AvgLowCube: {
            $round: ["$AvgLowCube", 2],
          },
          AvgLowCone: {
            $round: ["$AvgLowCone", 2],
          },
          AvgWeight: {
            $round: [
              {
                $sum: [
                  "$AvgAuto",
                  "$AvgTeleop",
                  "$AvgEndgame",
                ],
              },
              2,
            ],
          },
          RP: {
            $round: ["$Ranking", 2],
          },
          BestAuto: 1,
          BestTele: 1,
          AvgScore: {
            $round: ["$AvgScore", 2],
          },
          AvgDefense: {
            $round: ["$Defense", 2],
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
}

module.exports = averageSortedAggregationEvent