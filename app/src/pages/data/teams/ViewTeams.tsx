"use client";

import TeamForms from "@/components/teamForms/teamForms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

function DataTeams() {
  const { events, selectedEvent, eventForms, eventTeams } =
    useSuperAlliance();
  return (
    <>
      {eventForms && (
        <div className="h-full flex-col md:flex">
          <TeamForms
            forms={eventForms}
            teams={eventTeams}
            events={events}
            event={selectedEvent}
          />
        </div>
      )}
    </>
  );
}

export default DataTeams;
