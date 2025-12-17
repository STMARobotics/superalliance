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

  const teamList = await StandFormSchema.aggregate([
    {
      $match: { event: eventCode }
    },
    {
      $group: {
        _id: "$teamNumber",
        event: {
          $addToSet: "$event",
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

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
