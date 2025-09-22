const { Router } = require("express");

const settingsRouter = Router();

const { putConfig, getConfig } = require("../dynamo/configModel");
const { requireAuth, getAuth } = require("@clerk/express");

settingsRouter.post("/api/settings/app/save", requireAuth(), async (req, res) => {
  const userRole = getAuth(req).sessionClaims?.data?.role;

  if (userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  const data = req.body;

  await putConfig({ event: data.event }, req.query?.year || "DEFAULT");

  return res.send("Submitted Settings!");
});

settingsRouter.get("/api/settings/app", requireAuth(), async (req, res) => {
  const settings = await getConfig(req.query?.year || "DEFAULT");
  if (!settings) return res.send({});
  return res.send(settings);
});

module.exports = settingsRouter;
