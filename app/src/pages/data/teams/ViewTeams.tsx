"use client";

import TeamForms from "@/components/teamForms/teamForms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

function DataTeams() {
  const { forms, teams, events, selectedEvent, eventForms, eventTeams } =
    useSuperAlliance();
  return (
    <>
      {forms && (
        <div className="h-full flex-col md:flex">
          <TeamForms
            forms={selectedEvent !== "all" ? eventForms : forms}
            teams={selectedEvent !== "all" ? eventTeams : teams}
            events={events}
          />
        </div>
      )}
    </>
  );
}

export default DataTeams;
