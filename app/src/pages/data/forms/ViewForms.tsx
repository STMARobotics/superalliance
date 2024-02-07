"use client";

import Forms from "@/components/forms/forms";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useEffect, useState } from "react";

function DataForms() {
  const { forms, teams, events, selectedEvent } = useSuperAlliance();
  const [formList, setFormList] = useState([]);

  useEffect(() => {
    if (!forms) return;
    if (selectedEvent !== "all")
      return setFormList(
        forms.filter((form: any) => form.event === selectedEvent)
      );
    return setFormList(forms);
  }, [selectedEvent, forms]);

  return (
    <>
      {formList && (
        <div className="h-full flex-col md:flex">
          <Forms forms={formList} teams={teams} events={events} />
        </div>
      )}
    </>
  );
}

export default DataForms;
