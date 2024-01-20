const app = require("../../index");
const PitFormSchema = require("../../models/PitFormSchema");
const mongoose = require("mongoose");

app.get("/api/form/pit/:teamNumber", async (req, res) => {
  const teamNumber = req.params?.teamNumber;
  const data = await PitFormSchema.find({
    teamNumber: teamNumber,
  }).catch((err) => null);
  if (!data) return res.status(404).json({ error: "Form not found" });
  return res.send(data[0]);
});
