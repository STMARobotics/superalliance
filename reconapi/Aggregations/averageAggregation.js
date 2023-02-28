const averageAggregation = FormDataSchema.aggregate(
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
            _id: 1,
        },
    },
    ]
)

module.exports = averageAggregation