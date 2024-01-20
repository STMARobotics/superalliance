const app = require("../../index");
const StandFormSchema = require("../../models/StandFormSchema");
const mongoose = require("mongoose");

app.get("/api/form/stand/:formId", async (req, res) => {
  const formId = req.params?.formId;
  const data = await StandFormSchema.find({
    _id: formId,
  }).catch((err) => null);
  if (!data) return res.status(404).json({ error: "Form not found" });
  return res.send(data[0]);
});
