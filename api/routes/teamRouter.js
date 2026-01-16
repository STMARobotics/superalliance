const { Router } = require("express");
const { yearSchema, eventCodeSchema, teamNumberSchema } = require("../validation/paramValidators");

const teamRouter = Router();

const StandFormSchema = require("../models/StandFormSchema");
const mongoose = require("mongoose");
const axios = require("axios");
const { requireAuth } = require("@clerk/express");

teamRouter.get("/api/team/:teamNumber", requireAuth(), async (req, res) => {
  const validated = teamNumberSchema.safeParse(req.params.teamNumber);
  if (!validated.success) {
    return res.status(400).json({ 
      error: "Invalid team number",
      details: validated.error.issues.map((e) => e.message)
    });
  }
  const teamNumber = validated.data;
  const response = await axios
    .get(`https://www.thebluealliance.com/api/v3/team/frc${teamNumber}`, {
      method: "GET",
      headers: {
        "X-TBA-Auth-Key": `${process.env.TBA_KEY}`,
        accept: "application/json",
      },
    })
    .catch(() => "Error");
  if (response === "Error") return res.send("");
  return res.send(response.data);
});

teamRouter.get("/api/teams/:year/:eventCode", requireAuth(), async (req, res) => {
  const validatedYear = yearSchema.safeParse(req.params.year);
  const validatedEventCode = eventCodeSchema.safeParse(req.params.eventCode);
  
  if (!validatedYear.success) {
    return res.status(400).json({ 
      error: "Invalid year",
      details: validatedYear.error.issues.map((e) => e.message)
    });
  }
  
  if (!validatedEventCode.success) {
    return res.status(400).json({ 
      error: "Invalid eventCode",
      details: validatedEventCode.error.issues.map((e) => e.message)
    });
  }

  const year = validatedYear.data;
  const eventCode = validatedEventCode.data;

  // Fetch team statuses and team info in parallel
  const [statusResponse, teamsResponse] = await Promise.all([
    axios
      .get(`https://www.thebluealliance.com/api/v3/event/${year}${eventCode}/teams/statuses`, {
        headers: {
          "X-TBA-Auth-Key": `${process.env.TBA_KEY}`,
          accept: "application/json",
        },
      })
      .catch(() => null),
    axios
      .get(`https://www.thebluealliance.com/api/v3/event/${year}${eventCode}/teams`, {
        headers: {
          "X-TBA-Auth-Key": `${process.env.TBA_KEY}`,
          accept: "application/json",
        },
      })
      .catch(() => null),
  ]);

  if (!statusResponse || !teamsResponse) {
    return res.status(500).json({ error: "Failed to fetch team data from TBA" });
  }

  const teamStatuses = statusResponse.data;
  const teams = teamsResponse.data;

  // Combine team info with their statuses
  const teamArray = teams.map((team) => {
    const teamKey = team.key;
    const statusInfo = teamStatuses[teamKey];

    return {
      teamNumber: team.team_number,
      teamName: team.nickname ? team.nickname : "Unknown Team",
      teamLocation:
        team.city && team.state_prov ? `${team.city}, ${team.state_prov}` : "Unknown Location",
      teamRank: statusInfo?.qual?.ranking?.rank || 0,
    };
  });

  res.send(teamArray);
});

module.exports = teamRouter;
