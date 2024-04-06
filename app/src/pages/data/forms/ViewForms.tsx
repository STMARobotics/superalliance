"use client";

import Forms from "@/components/forms/forms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

function DataForms() {
  const { forms, teams, events, selectedEvent, eventForms, eventTeams } =
    useSuperAlliance();

  return (
    <>
      <div className="h-full flex-col md:flex">
        {selectedEvent == "all" ? (
          <>
            {forms && (
              <Forms
                forms={forms}
                teams={selectedEvent !== "all" ? eventTeams : teams}
                events={events}
                selectedEvent={selectedEvent}
              />
            )}
          </>
        ) : (
          <>
            {eventForms && (
              <Forms
                forms={eventForms}
                teams={selectedEvent !== "all" ? eventTeams : teams}
                events={events}
                selectedEvent={selectedEvent}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default DataForms;
