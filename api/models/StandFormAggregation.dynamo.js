// DynamoDB-backed aggregation replacement for StandFormAggregation
const { getStandFormsByEvent } = require("../dynamo/standFormModel");

function toNum(n) { return typeof n === 'number' ? n : (n ? Number(n) : 0); }

function calcDerived(form) {
  const autoScore = 3*toNum(form.autoCoralL1) + 4*toNum(form.autoCoralL2) + 6*toNum(form.autoCoralL3) + 7*toNum(form.autoCoralL4)
    + 6*toNum(form.autoAlgaeProcessor) + 4*toNum(form.autoAlgaeNet);
  const teleScore = 2*toNum(form.teleopCoralL1) + 3*toNum(form.teleopCoralL2) + 4*toNum(form.teleopCoralL3) + 5*toNum(form.teleopCoralL4)
    + 6*toNum(form.teleopAlgaeProcessor) + 4*toNum(form.teleopAlgaeNet)
    + (form.park ? 2 : 0) + (form.shallowClimb ? 6 : 0) + (form.deepClimb ? 12 : 0);
  const totalScore = autoScore + teleScore;
  const totalCoral = toNum(form.autoCoralL1) + toNum(form.autoCoralL2) + toNum(form.autoCoralL3) + toNum(form.autoCoralL4)
    + toNum(form.teleopCoralL1) + toNum(form.teleopCoralL2) + toNum(form.teleopCoralL3) + toNum(form.teleopCoralL4);
  const totalAutoCoral = toNum(form.autoCoralL1) + toNum(form.autoCoralL2) + toNum(form.autoCoralL3) + toNum(form.autoCoralL4);
  const totalTeleCoral = toNum(form.teleopCoralL1) + toNum(form.teleopCoralL2) + toNum(form.teleopCoralL3) + toNum(form.teleopCoralL4);
  const totalAlgae = toNum(form.autoAlgaeProcessor) + toNum(form.autoAlgaeNet) + toNum(form.teleopAlgaeProcessor) + toNum(form.teleopAlgaeNet);
  const totalProcessedAlgae = toNum(form.autoAlgaeProcessor) + toNum(form.teleopAlgaeProcessor);
  const totalNetAlgae = toNum(form.autoAlgaeNet) + toNum(form.teleopAlgaeNet);
  const totalL1Coral = toNum(form.teleopCoralL1);
  const totalL2Coral = toNum(form.teleopCoralL2);
  const totalL3Coral = toNum(form.teleopCoralL3);
  const totalL4Coral = toNum(form.teleopCoralL4);
  const leaveBoolean = form.leave ? 1 : 0;
  const parkBoolean = form.park ? 1 : 0;
  const defenseBoolean = form.defense ? 1 : 0;
  const defendedAgainstBoolean = form.defendedAgainst ? 1 : 0;
  const shallowClimbBoolean = form.shallowClimb ? 1 : 0;
  const deepClimbBoolean = form.deepClimb ? 1 : 0;
  const winBoolean = form.win ? 1 : 0;
  const coralBotBoolean = ((toNum(form.teleopCoralL1) + toNum(form.teleopCoralL2) + toNum(form.teleopCoralL3) + toNum(form.teleopCoralL4)) > 6) ? 1 : 0;
  const algaeBotBoolean = (toNum(form.teleopAlgaeNet) > 2) ? 1 : 0;
  const criticalCount = Array.isArray(form.criticals) ? form.criticals.length : 0;
  return {
    autoScore, teleScore, totalScore, totalCoral, totalAutoCoral, totalTeleCoral,
    totalAlgae, totalProcessedAlgae, totalNetAlgae, totalL1Coral, totalL2Coral, totalL3Coral, totalL4Coral,
    leaveBoolean, parkBoolean, defenseBoolean, defendedAgainstBoolean, shallowClimbBoolean, deepClimbBoolean, winBoolean,
    coralBotBoolean, algaeBotBoolean, criticalCount,
  };
}

function pushIfNonZero(arr, value, score, formId, matchNumber) {
  if (score !== 0) arr.push({ matchNumber, score, formId });
}

async function StandFormAggregationDynamo(eventId) {
  const forms = await getStandFormsByEvent(eventId);
  const byTeam = new Map();
  for (const f of forms) {
    const d = calcDerived(f);
    const key = f.teamNumber;
    if (!byTeam.has(key)) {
      byTeam.set(key, {
        _id: key,
        totalScore: 0, totalAutoScore: 0, totalTeleScore: 0,
        totalCoral: 0, totalAutoCoral: 0, totalTeleCoral: 0,
        totalAlgae: 0, totalProcessedAlgae: 0, totalNetAlgae: 0,
        totalL1Coral: 0, totalL2Coral: 0, totalL3Coral: 0, totalL4Coral: 0,
        matchTotalCoral: [], matchAutoCoral: [], matchTeleCoral: [],
        matchTotalAlgae: [], matchProcessedAlgae: [], matchNetAlgae: [],
        matchTotalScores: [], matchAutoScores: [], matchTeleScores: [],
        matchRP: [],
        avgTotalScore: 0, avgAutoScore: 0, avgTeleScore: 0,
        avgTotalCoral: 0, avgAutoCoral: 0, avgTeleCoral: 0,
        avgTotalAlgae: 0, avgProcessedAlgae: 0, avgNetAlgae: 0,
        leavePercentage: 0, parkPercentage: 0, defensePercentage: 0, defendedAgainstPercentage: 0,
        shallowClimbPercentage: 0, deepClimbPercentage: 0, winPercentage: 0,
        coralBotPercentage: 0, algaeBotPercentage: 0,
        avgRP: 0, comments: [], criticals: [], criticalCount: 0, matchCount: 0,
      });
    }
    const acc = byTeam.get(key);
    acc.totalScore += d.totalScore;
    acc.totalAutoScore += d.autoScore;
    acc.totalTeleScore += d.teleScore;
    acc.totalCoral += d.totalCoral;
    acc.totalAutoCoral += d.totalAutoCoral;
    acc.totalTeleCoral += d.totalTeleCoral;
    acc.totalAlgae += d.totalAlgae;
    acc.totalProcessedAlgae += d.totalProcessedAlgae;
    acc.totalNetAlgae += d.totalNetAlgae;
    acc.totalL1Coral += d.totalL1Coral;
    acc.totalL2Coral += d.totalL2Coral;
    acc.totalL3Coral += d.totalL3Coral;
    acc.totalL4Coral += d.totalL4Coral;
    pushIfNonZero(acc.matchTotalCoral, f.totalCoral, d.totalCoral, f.id || f._id, f.matchNumber);
    pushIfNonZero(acc.matchAutoCoral, f.totalAutoCoral, d.totalAutoCoral, f.id || f._id, f.matchNumber);
    pushIfNonZero(acc.matchTeleCoral, f.totalTeleCoral, d.totalTeleCoral, f.id || f._id, f.matchNumber);
    pushIfNonZero(acc.matchTotalAlgae, f.totalAlgae, d.totalAlgae, f.id || f._id, f.matchNumber);
    pushIfNonZero(acc.matchProcessedAlgae, f.totalProcessedAlgae, d.totalProcessedAlgae, f.id || f._id, f.matchNumber);
    pushIfNonZero(acc.matchNetAlgae, f.totalNetAlgae, d.totalNetAlgae, f.id || f._id, f.matchNumber);
    pushIfNonZero(acc.matchTotalScores, f.totalScore, d.totalScore, f.id || f._id, f.matchNumber);
    pushIfNonZero(acc.matchAutoScores, f.autoScore, d.autoScore, f.id || f._id, f.matchNumber);
    pushIfNonZero(acc.matchTeleScores, f.teleScore, d.teleScore, f.id || f._id, f.matchNumber);
    if (f.rpEarned) acc.matchRP.push({ matchNumber: f.matchNumber, score: f.rpEarned, formId: f.id || f._id });
    acc.leavePercentage += d.leaveBoolean * 100;
    acc.parkPercentage += d.parkBoolean * 100;
    acc.defensePercentage += d.defenseBoolean * 100;
    acc.defendedAgainstPercentage += d.defendedAgainstBoolean * 100;
    acc.shallowClimbPercentage += d.shallowClimbBoolean * 100;
    acc.deepClimbPercentage += d.deepClimbBoolean * 100;
    acc.winPercentage += d.winBoolean * 100;
    acc.coralBotPercentage += d.coralBotBoolean * 100;
    acc.algaeBotPercentage += d.algaeBotBoolean * 100;
    acc.avgRP += toNum(f.rpEarned);
    if (Array.isArray(f.criticals) && f.criticals.length) acc.criticals.push({ matchNumber: f.matchNumber, criticals: f.criticals, formId: f.id || f._id });
    if (f.comments) acc.comments.push({ matchNumber: f.matchNumber, comments: f.comments, formId: f.id || f._id, usersName: f.usersName });
    acc.criticalCount += d.criticalCount;
    acc.matchCount += 1;
  }

  // finalize averages and formatting
  const result = Array.from(byTeam.values()).map((acc) => {
    const mc = acc.matchCount || 1;
    return {
      _id: acc._id,
      totalScore: Number(acc.totalScore.toFixed(2)),
      totalAutoScore: Number(acc.totalAutoScore.toFixed(2)),
      totalTeleScore: Number(acc.totalTeleScore.toFixed(2)),
      totalCoral: Number(acc.totalCoral.toFixed(2)),
      totalAutoCoral: Number(acc.totalAutoCoral.toFixed(2)),
      totalTeleCoral: Number(acc.totalTeleCoral.toFixed(2)),
      totalAlgae: Number(acc.totalAlgae.toFixed(2)),
      totalProcessedAlgae: Number(acc.totalProcessedAlgae.toFixed(2)),
      totalNetAlgae: Number(acc.totalNetAlgae.toFixed(2)),
      totalL1Coral: Number(acc.totalL1Coral.toFixed(2)),
      totalL2Coral: Number(acc.totalL2Coral.toFixed(2)),
      totalL3Coral: Number(acc.totalL3Coral.toFixed(2)),
      totalL4Coral: Number(acc.totalL4Coral.toFixed(2)),
      matchTotalCoral: acc.matchTotalCoral,
      matchAutoCoral: acc.matchAutoCoral,
      matchTeleCoral: acc.matchTeleCoral,
      matchTotalAlgae: acc.matchTotalAlgae,
      matchProcessedAlgae: acc.matchProcessedAlgae,
      matchNetAlgae: acc.matchNetAlgae,
      matchTotalScore: acc.matchTotalScores,
      matchAutoScore: acc.matchAutoScores,
      matchTeleScore: acc.matchTeleScores,
      matchRP: acc.matchRP,
      avgTotalScore: Number((acc.totalScore / mc).toFixed(2)),
      avgAutoScore: Number((acc.totalAutoScore / mc).toFixed(2)),
      avgTeleScore: Number((acc.totalTeleScore / mc).toFixed(2)),
      avgTotalCoral: Number((acc.totalCoral / mc).toFixed(2)),
      avgAutoCoral: Number((acc.totalAutoCoral / mc).toFixed(2)),
      avgTeleCoral: Number((acc.totalTeleCoral / mc).toFixed(2)),
      avgTotalAlgae: Number((acc.totalAlgae / mc).toFixed(2)),
      avgProcessedAlgae: Number((acc.totalProcessedAlgae / mc).toFixed(2)),
      avgNetAlgae: Number((acc.totalNetAlgae / mc).toFixed(2)),
      leavePercentage: Number((acc.leavePercentage / mc).toFixed(2)),
      parkPercentage: Number((acc.parkPercentage / mc).toFixed(2)),
      defensePercentage: Number((acc.defensePercentage / mc).toFixed(2)),
      defendedAgainstPercentage: Number((acc.defendedAgainstPercentage / mc).toFixed(2)),
      shallowClimbPercentage: Number((acc.shallowClimbPercentage / mc).toFixed(2)),
      deepClimbPercentage: Number((acc.deepClimbPercentage / mc).toFixed(2)),
      winPercentage: Number((acc.winPercentage / mc).toFixed(2)),
      coralBotPercentage: Number((acc.coralBotPercentage / mc).toFixed(2)),
      algaeBotPercentage: Number((acc.algaeBotPercentage / mc).toFixed(2)),
      avgRP: Number((acc.avgRP / mc).toFixed(2)),
      comments: acc.comments,
      criticals: acc.criticals,
      criticalCount: acc.criticalCount,
      matchCount: acc.matchCount,
    };
  }).sort((a,b) => a._id - b._id);

  return result;
}

module.exports = StandFormAggregationDynamo;
