const app = require("../../index");
const StandFormSchema = require("../../models/StandFormSchema");
const mongoose = require("mongoose");
const axios = require("axios");

app.get("/api/listEvents/:team/:year", async (req, res) => {
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
  if (!response) return res.status(404).json({ error: "Form not found!" });
  return res.send(response);
});
