const { getAuth } = require("@clerk/express");

// Middleware to require authentication
const requireAuth = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Middleware to require admin role
const requireAdmin = (req, res, next) => {
  const { userId, sessionClaims } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const role = sessionClaims?.public_metadata?.role;

  if (role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  next();
};

module.exports = { requireAuth, requireAdmin };