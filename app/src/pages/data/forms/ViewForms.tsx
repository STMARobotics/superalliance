"use client";

import Forms from "@/components/forms/forms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useEffect, useState } from "react";

function DataForms() {
  const { forms, teams, events, selectedEvent } = useSuperAlliance();
  const [eventForms, setEventForms] = useState([]);

  useEffect(() => {
    if (selectedEvent !== "all")
      return setEventForms(
        forms?.filter((form: any) => form.event === selectedEvent)
      );
    return setEventForms(forms);
  }, [selectedEvent]);

  return (
    <>
      {selectedEvent !== "all" ? (
        <>
          {eventForms && (
            <div className="h-full flex-col md:flex">
              <Forms forms={eventForms} teams={teams} events={events} />
            </div>
          )}
        </>
      ) : (
        <>
          {forms && (
            <div className="h-full flex-col md:flex">
              <Forms forms={forms} teams={teams} events={events} />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default DataForms;
