const app = require("../../index");
const StandFormSchema = require("../../models/StandFormSchema");
const mongoose = require("mongoose");
const axios = require("axios");

app.get("/api/team/:teamNumber", async (req, res) => {
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
