const { Router } = require("express");

const teamSelectionRouter = Router();

const { putTeamSelection, getTeamSelection } = require("../dynamo/teamSelectionModel");
const { requireAuth, getAuth } = require("@clerk/express");

teamSelectionRouter.post("/api/teamSelection/save", requireAuth(), async (req, res) => {
  const userRole = getAuth(req).sessionClaims?.data?.role;

  if (userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  const data = req.body;

  await putTeamSelection(data.event, data.teams);

  return res.send("Submitted Team Selection!");
});

teamSelectionRouter.get("/api/teamSelection", requireAuth(), async (req, res) => {
  const userRole = getAuth(req).sessionClaims?.data?.role;

  if (userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  const selection = await getTeamSelection(req.query?.event || "DEFAULT");
  if (!selection) return res.send({});
  return res.send(selection);
});

module.exports = teamSelectionRouter;
