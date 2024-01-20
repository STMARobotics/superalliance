const { Router } = require("express");

const teamRouter = Router();

const StandFormSchema = require("../models/StandFormSchema");
const mongoose = require("mongoose");
const axios = require("axios");

teamRouter.get("/api/team/:teamNumber", async (req, res) => {
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

teamRouter.get("/api/listTeams", async (req, res) => {
  const teamList = await StandFormSchema.aggregate([
    {
      $group: {
        _id: "$teamNumber",
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const teamArray = await Promise.all(
    teamList.map(async ({ _id }) => {
      const response = await axios.get(
        `${process.env.API_URL}/api/team/${_id}`
      );
      const { nickname, city, state_prov } = response.data;
      return {
        teamNumber: _id,
        teamName: nickname ? nickname : "Unknown Team",
        teamLocation:
          city && state_prov ? `${city}, ${state_prov}` : "Unknown Location",
      };
    })
  );

  res.send(teamArray);
});

module.exports = teamRouter;
