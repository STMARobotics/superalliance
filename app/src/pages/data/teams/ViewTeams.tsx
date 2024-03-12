"use client";

import TeamForms from "@/components/teamForms/teamForms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

function DataTeams() {
  const { forms, teams, events, selectedEvent, eventForms, eventTeams } =
    useSuperAlliance();
  return (
    <>
      {selectedEvent == "all" ? (
        <>
          {forms && (
            <div className="h-full flex-col md:flex">
              <TeamForms forms={forms} teams={teams} events={events} />
            </div>
          )}
        </>
      ) : (
        <>
          {eventForms && (
            <div className="h-full flex-col md:flex">
              <TeamForms
                forms={eventForms}
                teams={eventTeams}
                events={events}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default DataTeams;
