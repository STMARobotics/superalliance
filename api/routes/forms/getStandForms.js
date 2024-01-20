const app = require("../../index");
const StandFormSchema = require("../../models/StandFormSchema");
const mongoose = require("mongoose");

app.get("/api/forms/stand", async (req, res) => {
  const forms = await StandFormSchema.find({}).sort({
    _id: -1,
  });
  return res.send(forms);
});
