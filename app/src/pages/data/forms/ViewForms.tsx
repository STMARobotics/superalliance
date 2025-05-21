"use client";

import Forms from "@/components/forms/forms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

function DataForms() {
  const { events, selectedEvent, eventForms, eventTeams } =
    useSuperAlliance();

  return (
    <>
      <div className="h-full flex-col md:flex">
        <Forms
          forms={eventForms}
          teams={eventTeams}
          events={events}
          selectedEvent={selectedEvent}
        />
      </div>
    </>
  );
}

export default DataForms;
