const { Router } = require("express");

const teamRouter = Router();

const { getStandFormsByEvent } = require("../dynamo/standFormModel");
const mongoose = require("mongoose");
const axios = require("axios");
const { requireAuth } = require("@clerk/express");

teamRouter.get("/api/team/:teamNumber", requireAuth(), async (req, res) => {
  const { teamNumber } = req.params;
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
  const { eventCode, year } = req.params;
  if (!eventCode || !year)
    return res.status(500).json({ error: "Missing year or event code" });


  const forms = await getStandFormsByEvent(eventCode);
  const teamSet = new Set(forms.map(f => f.teamNumber));
  const teamList = Array.from(teamSet).sort((a,b)=>a-b).map(tn => ({ _id: tn, event: [eventCode] }));

  const teamArray = await Promise.all(
    teamList.map(async ({ _id, event }) => {
      const response = await axios
        .get(`https://www.thebluealliance.com/api/v3/team/frc${_id}`, {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": `${process.env.TBA_KEY}`,
            accept: "application/json",
          },
        })
        .catch(() => "Error");
      if (response === "Error") return res.send("");
      const rank = await axios.get(
        `https://www.thebluealliance.com/api/v3/team/frc${_id}/event/${year}${eventCode}/status`,
        {
          headers: {
            "X-TBA-Auth-Key": `${process.env.TBA_KEY}`,
            accept: "application/json",
          },
        }
      );
      const { nickname, city, state_prov } = response.data;
      return {
        teamNumber: _id,
        teamEvent: event,
        teamName: nickname ? nickname : "Unknown Team",
        teamLocation:
          city && state_prov ? `${city}, ${state_prov}` : "Unknown Location",
        teamRank: rank?.data?.qual?.ranking?.rank
          ? rank?.data?.qual?.ranking?.rank
          : 0,
      };
    })
  );

  res.send(teamArray);
});

module.exports = teamRouter;
