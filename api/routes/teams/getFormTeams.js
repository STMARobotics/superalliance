const app = require("../../index");
const StandFormSchema = require("../../models/StandFormSchema");
const mongoose = require("mongoose");
const axios = require("axios");

app.get("/api/listTeams", async (req, res) => {
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
