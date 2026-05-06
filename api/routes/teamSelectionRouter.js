const { Router } = require("express");

const teamSelectionRouter = Router();

const TeamSelectionSchema = require("../models/TeamSelectionSchema");
const mongoose = require("mongoose");
const { requireAuth, getAuth } = require("@clerk/express");

const UTF8_BOM = '\uFEFF';

teamSelectionRouter.post("/api/teamSelection/save/:eventCode", requireAuth(), async (req, res) => {
  const auth = getAuth(req);
  const userRole = auth.sessionClaims?.data?.role;

  if (userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  
  const { eventCode } = req.params;
  const { teams } = req.body;
  const userId = auth.userId || "Unknown";

  try {
    const newSelection = new TeamSelectionSchema({
      _id: new mongoose.Types.ObjectId(),
      eventCode,
      userId,
      teams
    });

    await newSelection.save();
    return res.send("Submitted Team Selection!");
  } catch (err) {
    console.error("Error saving team selection:", err);
    return res.status(500).json({ error: "Failed to save team selection" });
  }
});

teamSelectionRouter.get("/api/teamSelection/:eventCode", requireAuth(), async (req, res) => {
  const auth = getAuth(req);
  const userRole = auth.sessionClaims?.data?.role;

  if (userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  
  const { eventCode } = req.params;
  
  // Get the latest selection for this event
  const selection = await TeamSelectionSchema
    .findOne({ eventCode })
    .sort({ updatedAt: -1 }); // Latest first
    
  if (!selection) return res.send({});
  return res.send(selection);
});

teamSelectionRouter.get("/api/teamSelection/:eventCode/report", requireAuth(), async (req, res) => {
  const auth = getAuth(req);
  const userRole = auth.sessionClaims?.data?.role;

  if (userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  const { eventCode } = req.params;
  
  try {
    // Get the latest selection for this event
    const selection = await TeamSelectionSchema
      .findOne({ eventCode })
      .sort({ updatedAt: -1 });
      
    if (!selection) {
      return res.status(404).json({ error: "No team selection found for this event" });
    }

    // Group teams by column
    const teamsByColumn = {
      unsorted: [],
      r1: [],
      r2: [],
      r3: []
    };

    selection.teams.forEach(team => {
      if (teamsByColumn[team.columnId]) {
        teamsByColumn[team.columnId].push(team);
      }
    });

    // Generate CSV content
    const includeUnsorted = teamsByColumn.unsorted.length > 0;
    
    const maxRows = Math.max(
      includeUnsorted ? teamsByColumn.unsorted.length : 0,
      teamsByColumn.r1.length,
      teamsByColumn.r2.length,
      teamsByColumn.r3.length
    );

    // Build header row conditionally
    const headers = [];
    if (includeUnsorted) headers.push(`Unsorted (${teamsByColumn.unsorted.length})`);
    headers.push(`R1 (${teamsByColumn.r1.length})`);
    headers.push(`R2 (${teamsByColumn.r2.length})`);
    headers.push(`R3 (${teamsByColumn.r3.length})`);
    
    let csvContent = headers.join(',') + '\n';
    
    for (let i = 0; i < maxRows; i++) {
      const row = [];
      if (includeUnsorted) {
        row.push(teamsByColumn.unsorted[i] ? `${teamsByColumn.unsorted[i].teamNumber} - ${teamsByColumn.unsorted[i].teamName}` : '');
      }
      row.push(teamsByColumn.r1[i] ? `${teamsByColumn.r1[i].teamNumber} - ${teamsByColumn.r1[i].teamName}` : '');
      row.push(teamsByColumn.r2[i] ? `${teamsByColumn.r2[i].teamNumber} - ${teamsByColumn.r2[i].teamName}` : '');
      row.push(teamsByColumn.r3[i] ? `${teamsByColumn.r3[i].teamNumber} - ${teamsByColumn.r3[i].teamName}` : '');
      
      // Escape commas and quotes in CSV
      const escapedRow = row.map(cell => {
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      });
      
      csvContent += escapedRow.join(',') + '\n';
    }

    // Excel often assumes ANSI for CSV unless a UTF-8 BOM is present.
    csvContent = UTF8_BOM + csvContent;

    // Set appropriate headers for CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="team-selection-${eventCode}-${new Date().toISOString().split('T')[0]}.csv"`);
    
    return res.send(csvContent);
    
  } catch (err) {
    console.error('Error generating report:', err);
    return res.status(500).json({ error: "Failed to generate report" });
  }
});

module.exports = teamSelectionRouter;
