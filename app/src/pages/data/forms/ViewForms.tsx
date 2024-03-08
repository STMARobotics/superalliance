"use client";

import Forms from "@/components/forms/forms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

function DataForms() {
  const { forms, teams, events, selectedEvent, eventForms, eventTeams } =
    useSuperAlliance();

  return (
    <>
      <div className="h-full flex-col md:flex">
        {selectedEvent !== "all" ? (
          <>
            {eventForms && (
              <Forms
                forms={eventForms}
                teams={selectedEvent !== "all" ? eventTeams : teams}
                events={events}
              />
            )}
          </>
        ) : (
          <>
            {forms && (
              <Forms
                forms={forms}
                teams={selectedEvent !== "all" ? eventTeams : teams}
                events={events}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default DataForms;
