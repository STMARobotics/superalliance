

const StandFormSchema = require("./StandFormSchema");

const StandQuantFormAggregation = (eventId) => {
	let pipeline = [
		{
			$addFields: {
				totalScore: {
					$add: [
						{ $multiply: ["$autoFuel", 1] },
						{ $multiply: ["$teleFuel", 1] },
					],
				},
				autoScore: { $multiply: ["$autoFuel", 1] },
				teleScore: { $multiply: ["$teleFuel", 1] },
				totalFuel: { $add: ["$autoFuel", "$teleFuel"] },
				totalAutoFuel: { $add: ["$autoFuel"] },
				totalTeleFuel: { $add: ["$teleFuel"] },
			},
		},
		{
			$group: {
				_id: "$teamNumber",
				totalScore: { $sum: "$totalScore" },
				totalAutoScore: { $sum: "$autoScore" },
				totalTeleScore: { $sum: "$teleScore" },
				totalFuel: { $sum: "$totalFuel" },
				totalAutoFuel: { $sum: "$totalAutoFuel" },
				totalTeleFuel: { $sum: "$totalTeleFuel" },
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
				avgTotalScore: { $avg: "$totalScore" },
				avgAutoScore: { $avg: "$autoScore" },
				avgTeleScore: { $avg: "$teleScore" },
				avgTotalFuel: { $avg: "$totalFuel" },
				avgAutoFuel: { $avg: "$totalAutoFuel" },
				avgTeleFuel: { $avg: "$totalTeleFuel" },
				matchCount: { $sum: 1 },
			},
		},
		{
			$project: {
				teamNumber: 1,
				totalScore: { $round: ["$totalScore", 2] },
				totalAutoScore: { $round: ["$totalAutoScore", 2] },
				totalTeleScore: { $round: ["$totalTeleScore", 2] },
				totalFuel: { $round: ["$totalFuel", 2] },
				totalAutoFuel: { $round: ["$totalAutoFuel", 2] },
				totalTeleFuel: { $round: ["$totalTeleFuel", 2] },
				matchTotalFuel: { $concatArrays: "$matchTotalFuel" },
				matchAutoFuel: { $concatArrays: "$matchAutoFuel" },
				matchTeleFuel: { $concatArrays: "$matchTeleFuel" },
				matchTotalScore: { $concatArrays: "$matchTotalScores" },
				matchAutoScore: { $concatArrays: "$matchAutoScores" },
				matchTeleScore: { $concatArrays: "$matchTeleScores" },
				avgTotalScore: { $round: ["$avgTotalScore", 2] },
				avgAutoScore: { $round: ["$avgAutoScore", 2] },
				avgTeleScore: { $round: ["$avgTeleScore", 2] },
				avgTotalFuel: { $round: ["$avgTotalFuel", 2] },
				avgAutoFuel: { $round: ["$avgAutoFuel", 2] },
				avgTeleFuel: { $round: ["$avgTeleFuel", 2] },
				matchCount: 1,
			},
		},
		{
			$sort: { _id: 1 },
		},
	];

	if (eventId) pipeline.unshift({ $match: { event: eventId } });

	return StandFormSchema.aggregate(pipeline);
};

module.exports = StandQuantFormAggregation;
