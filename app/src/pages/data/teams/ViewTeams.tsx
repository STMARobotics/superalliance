"use client";

import TeamForms from "@/components/teamForms/teamForms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

function DataTeams() {
  const { forms, teams, events } = useSuperAlliance();
  return (
    <>
      {forms && (
        <div className="h-full flex-col md:flex">
          <TeamForms forms={forms} teams={teams} events={events} />
        </div>
      )}
    </>
  );
}

export default DataTeams;
