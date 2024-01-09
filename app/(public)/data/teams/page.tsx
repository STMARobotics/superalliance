"use client";

import Forms from "@/components/forms/forms";
import TeamForms from "@/components/teamForms/teamForms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

function DataTeams() {
  const { forms, events } = useSuperAlliance();
  return (
    <>
      {forms && (
        <div className="h-full flex-col md:flex">
          <TeamForms forms={forms} events={events} />
        </div>
      )}
    </>
  );
}

export default DataTeams;
