"use client";

import Forms from "@/components/forms/forms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

function DataForms() {
  const { forms, teams, events } = useSuperAlliance();
  return (
    <>
      {forms && (
        <div className="h-full flex-col md:flex">
          <Forms forms={forms} teams={teams} events={events} />
        </div>
      )}
    </>
  );
}

export default DataForms;
