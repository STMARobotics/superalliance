"use client";

import Forms from "@/components/forms/forms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

function DataForms() {
  const { forms, teams, events, selectedEvent, eventForms, eventTeams } =
    useSuperAlliance();

  return (
    <>
      <div className="h-full flex-col md:flex">
        {forms && (
          <Forms
            forms={selectedEvent !== "all" ? eventForms : forms}
            teams={selectedEvent !== "all" ? eventTeams : teams}
            events={events}
          />
        )}
      </div>
    </>
  );
}

export default DataForms;
