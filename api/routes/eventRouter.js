const { Router } = require("express");

const eventRouter = Router();

const mongoose = require("mongoose");
const axios = require("axios");

eventRouter.get(
  "/api/event/:eventCode/match/:matchNumber/data",
  async (req, res) => {
    try {
      const { eventCode, matchNumber } = req.params;
      const response = await axios.get(
        `https://www.thebluealliance.com/api/v3/match/2025${eventCode}_qm${matchNumber}`,
        {
          headers: {
            "X-TBA-Auth-Key": `${process.env.TBA_KEY}`,
            accept: "application/json",
          },
        }
      );
      const data = response.data;
      if (!data)
        return res
          .status(404)
          .json({ error: "Event match or teams not found!" });
      return res.send(data);
    } catch {
      return res.status(404).json({ error: "Event match or teams not found!" });
    }
  }
);

eventRouter.get(
  "/api/event/:eventCode/team/:teamNumber/rank",
  async (req, res) => {
    try {
      const { eventCode, teamNumber } = req.params;
      const response = await axios.get(
        `https://www.thebluealliance.com/api/v3/team/frc${teamNumber}/event/2025${eventCode}/status`,
        {
          headers: {
            "X-TBA-Auth-Key": `${process.env.TBA_KEY}`,
            accept: "application/json",
          },
        }
      );
      const data = response.data;
      if (!data)
        return res
          .status(404)
          .json({ error: "Event match or teams not found!" });
      return res.send(data);
    } catch {
      return res.status(404).json({ error: "Event match or teams not found!" });
    }
  }
);

eventRouter.get(
  "/api/event/:eventCode/opr",
  async (req, res) => {
    try {
      const { eventCode, teamNumber } = req.params;
      const response = await axios.get(
        `https://www.thebluealliance.com/api/v3/event/2025${eventCode}/oprs`,
        {
          headers: {
            "X-TBA-Auth-Key": `${process.env.TBA_KEY}`,
            accept: "application/json",
          },
        }
      );
      const data = response.data;
      if (!data)
        return res
          .status(404)
          .json({ error: "Event not found!" });
      return res.send(data);
    } catch {
      return res.status(404).json({ error: "Event not found!" });
    }
  }
);

eventRouter.get(
  "/api/event/:eventCode/match/:matchNumber/teams",
  async (req, res) => {
    try {
      const { eventCode, matchNumber } = req.params;
      const response = await axios.get(
        `https://www.thebluealliance.com/api/v3/match/2025${eventCode}_qm${matchNumber}`,
        {
          headers: {
            "X-TBA-Auth-Key": `${process.env.TBA_KEY}`,
            accept: "application/json",
          },
        }
      );
      const data = response.data;
      if (!data)
        return res
          .status(404)
          .json({ error: "Event match or teams not found!" });
      const teamStruct = {
        red: data.alliances.red.team_keys.map((team) => {
          return team.replace("frc", "");
        }),
        blue: data.alliances.blue.team_keys.map((team) => {
          return team.replace("frc", "");
        }),
      };
      return res.send(teamStruct);
    } catch {
      return res.status(404).json({ error: "Event match or teams not found!" });
    }
  }
);

eventRouter.get("/api/listEvents/:team/:year", async (req, res) => {
  const { team, year } = req.params;
  if (!team || !year)
    return res.status(500).json({ error: "Missing team or year" });
  const data = await axios.get(
    `https://www.thebluealliance.com/api/v3/team/frc${team}/events/${year}`,
    {
      method: "GET",
      headers: {
        "X-TBA-Auth-Key": `${process.env.TBA_KEY}`,
        accept: "application/json",
      },
    }
  );
  const response = data.data;
  response.unshift({
    event_code: "worldsprac",
    short_name: "Worlds Practice",
  });
  response.unshift({ event_code: "gnrprac", short_name: "GNR Practice" });
  response.unshift({ event_code: "gcrprac", short_name: "GCR Practice" });
  response.unshift({ event_code: "testing", short_name: "Testing Event" });
  response.unshift({ event_code: "week0", short_name: "Week 0" });
  if (!response) return res.status(404).json({ error: "Form not found!" });
  return res.send(response);
});

module.exports = eventRouter;
