"use client";

import Forms from "@/components/forms/forms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

function DataForms() {
  const { forms, events } = useSuperAlliance();
  return (
    <>
      {forms && (
        <div className="h-full flex-col md:flex">
          <Forms forms={forms} events={events} />
        </div>
      )}
    </>
  );
}

export default DataForms;
